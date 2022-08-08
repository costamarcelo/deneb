export * as vegaUtils from './vegaUtils';
export * as vegaLiteUtils from './vegaLiteUtils';
export {
    IVegaViewDatum,
    TSpecProvider,
    TSpecRenderMode,
    determineProviderFromSpec,
    editorConfigOverLoad,
    getParsedConfigFromSettings,
    getVegaProvider,
    getVegaProvideri18n,
    getVegaSettings,
    getVegaVersion,
    getViewConfig,
    getViewDataset,
    getViewSpec,
    handleNewView
};

import cloneDeep from 'lodash/cloneDeep';
import * as Vega from 'vega';
import Config = Vega.Config;
import Spec = Vega.Spec;
import View = Vega.View;
import { TopLevelSpec } from 'vega-lite';

import { hostServices, loggerServices } from '../services';
import { cleanParse } from '../utils/json';
import { vegaLiteValidator, vegaValidator } from './validation';
import {
    getState,
    useStoreDataset,
    useStoreProp,
    useStoreVegaProp
} from '../../store';
import { getConfig, providerVersions } from '../utils/config';
import { getPatchedVegaSpec } from './vegaUtils';
import { getPatchedVegaLiteSpec } from './vegaLiteUtils';

import { resolveSvgFilter } from '../ui/svgFilter';
import { i18nValue } from '../ui/i18n';
import {
    bindContextMenuEvents,
    bindCrossFilterEvents
} from '../../features/interactivity';

/**
 * Interface specifying a flexible key/value pair object, which is supplied from Vega's tooltip handler and usually casted as `any`.
 */
interface IVegaViewDatum {
    [key: string]: any;
}

/**
 * Valid providers for the visual.
 */
type TSpecProvider = 'vega' | 'vegaLite';

/**
 * Used to constrain Vega rendering to supported types.
 */
type TSpecRenderMode = 'svg' | 'canvas';

const editorConfigOverLoad = {
    background: null, // so we can defer to the Power BI background, if applied
    customFormatTypes: true
};

/**
 * For the supplied spec, parse it to determine which provider we should use when importing it (precedence is Vega-Lite), and will then
 * fall-back to Vega if VL is not valid.
 */
const determineProviderFromSpec = (
    spec: Spec | TopLevelSpec
): TSpecProvider => {
    const vlValid = vegaLiteValidator(spec);
    if (vlValid) {
        return 'vegaLite';
    }
    const vValid = vegaValidator(spec);
    if (vValid) {
        return 'vega';
    }
    return null;
};

/**
 * Convenience function to get current Vega provider from persisted properties.
 */
const getVegaProvider = () => <TSpecProvider>getVegaSettings().provider;

/**
 * Get the Vega provider, resolved for i18n.
 */
const getVegaProvideri18n = () =>
    i18nValue(
        getVegaProvider() === 'vegaLite' ? 'Provider_VegaLite' : 'Provider_Vega'
    );

/**
 * For the current provider, get the version from our package configuration.
 */
const getVegaVersion = () => providerVersions[getVegaProvider()];

/**
 * Convenience function to get current Vega/Spec settings from the visual objects (as we use this a lot).
 */
const getVegaSettings = () => getState().visualSettings.vega;

/**
 * Create the `data` object for the Vega view specification. Ensures that the dataset applied to the visual is a cloned, mutable copy of the store version.
 */
const getViewDataset = () => ({
    dataset: cloneDeep(useStoreDataset()?.values)
});

/**
 * Form the config that is applied to the Vega view. This will retrieve the config from our visual properties, and enrich it with anything we want
 * to abstract out from the end-user to make things as "at home" in Power BI as possible, without explicitly adding it to the editor or exported template.
 */
const getViewConfig = (config = getParsedConfigFromSettings()): Config => {
    return {
        ...editorConfigOverLoad,
        ...config
    };
};

/**
 * Form the specification that is applied to the Vega view. This will retrieve the specification from our visual properties, and enrich it with anything we want
 * to abstract out from the end-user to make things as "at home" in Power BI as possible, without explicitly adding it to the editor or exported template.
 */
const getViewSpec = () => {
    const eSpec = useStoreProp<object>('spec', 'editorSpec');
    const provider = useStoreVegaProp<TSpecProvider>('provider');
    const vSpec = cloneDeep(eSpec) || {};
    switch (provider) {
        case 'vega':
            return getPatchedVegaSpec(vSpec);
        case 'vegaLite':
            return getPatchedVegaLiteSpec(vSpec);
        default:
            return vSpec;
    }
};

/**
 * Gets the `config` from our visual objects and parses it to JSON.
 */
const getParsedConfigFromSettings = (): Config => {
    const jsonConfig = useStoreVegaProp<string>('jsonConfig');
    return cleanParse(jsonConfig, propertyDefaults.jsonConfig);
};

/**
 * Any logic that we need to apply to a new Vega view.
 */
const handleNewView = (newView: View) => {
    newView.logger(loggerServices);
    newView.runAsync().then((view) => {
        resolveSvgFilter();
        bindContextMenuEvents(view);
        bindCrossFilterEvents(view);
        getState().updateEditorView(view);
        hostServices.renderingFinished();
    });
};

const propertyDefaults = getConfig().propertyDefaults.vega;
