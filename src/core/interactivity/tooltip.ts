import powerbi from 'powerbi-visuals-api';
import ITooltipService = powerbi.extensibility.ITooltipService;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;

import delay from 'lodash/delay';
import indexOf from 'lodash/indexOf';
import isDate from 'lodash/isDate';
import isObject from 'lodash/isObject';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import toNumber from 'lodash/toNumber';
import toString from 'lodash/toString';

import { isInteractivityReservedWord, resolveCoordinates } from '.';
import { i18nValue } from '../ui/i18n';
import { getJsonAsIndentedString } from '../utils/json';
import { getVegaSettings, IVegaViewDatum, resolveDataFromItem } from '../vega';

import { isFeatureEnabled } from '../utils/features';
import { getSelectionIdentitiesFromData } from './selection';
import { createFormatterFromString } from '../utils/formatting';
import { hostServices } from '../services';
import { getDatasetFieldsBySelectionKeys } from '../data/fields';

/**
 * Convenience constant for tooltip events, as it's required by Power BI.
 */
const isTouchEvent = true;

/**
 * Convenience constant that confirms whether the `tooltipHandler` feature switch is enabled via features.
 */
export const isHandlerEnabled = isFeatureEnabled('tooltipHandler');

/**
 *  Confirms whether the `tooltipResolveNumberFieldFormat` feature switch is enabled via features.
 */
const isResolveNumberFormatEnabled = () =>
    isHandlerEnabled && isFeatureEnabled('tooltipResolveNumberFieldFormat');

/**
 * For a given Vega `tooltip` object (key-value pairs), extract any non-reserved keys, and structure suitably as an array of standard
 * Power BI tooltip items (`VisualTooltipDataItem[]`).
 */
const extractTooltipDataItemsFromObject = (
    tooltip: Object,
    autoFormatFields: IVegaViewDatum
): VisualTooltipDataItem[] => {
    const autoFormatMetadata = getDatasetFieldsBySelectionKeys(
        keys(autoFormatFields)
    );
    return resolveDatumToArray(tooltip, false).map(([k, v]) => ({
        displayName: `${k}`,
        value: `${
            (autoFormatMetadata[k] &&
                createFormatterFromString(autoFormatMetadata[k].format).format(
                    (autoFormatMetadata[k].type.numeric && toNumber(v)) ||
                        (autoFormatMetadata[k].type.dateTime && v)
                )) ||
            getCuratedTooltipItem(k, getSanitisedTooltipValue(v))
        }`
    }));
};

/**
 * For a given tooltip item, if it's a reserved workd, return something more sensible to the end user than a complex object.
 */
const getCuratedTooltipItem = (key: string, value: any) =>
    isInteractivityReservedWord(key)
        ? i18nValue('Selection_KW_Present')
        : getDeepRedactedTooltipItem(value);

/**
 * Sometimes, we can fudge the aggregates or other operations to create deeply nested objects in our dataset. This will apply a deeper,
 * recursive search and replace of keys matching out interactivity reserved words and 'redact' them with indicators for tooltips.
 */
const getDeepRedactedTooltipItem = (object: Object) => {
    return Array.isArray(object)
        ? object.map(getDeepRedactedTooltipItem)
        : object && typeof object === 'object'
        ? Object.fromEntries(
              Object.entries(object).map(([k, v]) => [
                  k,
                  getCuratedTooltipItem(k, v)
              ])
          )
        : object;
};

/**
 * For given Vega `tooltip` object (key-value pairs), return an object of fields from the visual dataset's metadata that are in the tooltip,
 * and eligible for automatic formatting. Eligibility criteria is as follows:
 *
 *  - The `tooltipResolveNumberFieldFormat` feature is enabled, and:
 *  - The field display name has a corresponding entry in the visual datset's metadata, and:
 *  - The field is a number type, and:
 *  - The tooltip value exactly matches the number representation in the `datum`.
 */
const getFieldsEligibleForAutoFormat = (tooltip: Object) =>
    pickBy(tooltip, (v, k) => {
        const ttKeys = keys(tooltip),
            mdKeys = keys(getDatasetFieldsBySelectionKeys(ttKeys));
        return (
            indexOf(mdKeys, k) > -1 &&
            isResolveNumberFormatEnabled() &&
            toNumber(tooltip[k])
        );
    });

/**
 * Ensure that tooltip values are correctly sanitised for output into a default tooltip.
 */
const getSanitisedTooltipValue = (value: any) =>
    isObject(value) && !isDate(value)
        ? getJsonAsIndentedString(getDeepRedactedTooltipItem(value), 'tooltip')
        : toString(value);

/**
 * Get a new custom Vega tooltip handler for Power BI. If the supplied setting is enabled, will return a `resolveTooltipContent` handler
 * for the supplied `tooltipService`.
 */
export const getTooltipHandler = (
    isSettingEnabled: boolean,
    tooltipService: ITooltipService
) =>
    (isHandlerEnabled &&
        isSettingEnabled &&
        resolveTooltipContent(tooltipService)) ||
    undefined;

/**
 * Request Power BI hides the tooltip.
 */
export const hideTooltip = () => {
    const immediately = true;
    hostServices.tooltipService.hide({
        immediately,
        isTouchEvent
    });
};

/**
 * For a given datum, resolve it to an array of keys and values. Addiitonally, we can (optionally) ensure that the
 * `interactivityReservedWords` are stripped out so that we can get actual fields and values assigned to a datum.
 */
const resolveDatumToArray = (obj: IVegaViewDatum, filterReserved = true) =>
    Object.entries({ ...obj }).filter(
        ([k, v]) => (filterReserved && !isInteractivityReservedWord(k)) || k
    );

/**
 * For the supplied Power BI `ITooltipService` service instance from the visual host, apply the `vegaTooltip` object
 * (https://github.com/vega/vega-tooltip/blob/master/docs/APIs.md) supplied by the Vega view and attempt to show or hide a Power BI tooltip
 * based on its contents.
 */
const resolveTooltipContent =
    (tooltipService: ITooltipService) =>
    (handler: any, event: MouseEvent, item: any, value: any) => {
        const coordinates = resolveCoordinates(event);
        if (item && item.tooltip) {
            const datum = resolveDataFromItem(item);
            const tooltip = resolveTooltipItem(item.tooltip);
            const autoFormatFields = getFieldsEligibleForAutoFormat(tooltip);
            const dataItems = extractTooltipDataItemsFromObject(
                tooltip,
                autoFormatFields
            );
            const identities = getSelectionIdentitiesFromData(datum);
            const { tooltipDelay } = getVegaSettings();
            const waitFor = (event.ctrlKey && tooltipDelay) || 0;
            const options = {
                coordinates,
                dataItems,
                isTouchEvent,
                identities
            };
            switch (event.type) {
                case 'mouseover':
                case 'mousemove': {
                    delay(() => tooltipService.show(options), waitFor);
                    break;
                }
                default: {
                    hideTooltip();
                }
            }
        } else {
            hideTooltip();
        }
    };

/**
 * Because Power BI tooltips require key/value pairs, this processes scalar
 * values we receive from Vega signals into something that can work.
 */
const resolveTooltipItem = (tooltip: any) => {
    switch (true) {
        case typeof tooltip !== 'object':
            return { ' ': `${tooltip}` };
        default:
            return { ...tooltip };
    }
};
