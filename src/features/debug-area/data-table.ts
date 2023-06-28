import { isDate, isFunction, isNumber } from 'vega';
import { IStackItemStyles } from '@fluentui/react/lib/Stack';

import {
    DATASET_IDENTITY_NAME,
    DATASET_ROW_NAME,
    DATASET_SELECTED_NAME,
    TABLE_COLUMN_RESERVED_WORDS
} from '../../constants';
import { IDataTableWorkerTranslations } from './types';
import { gwtPrunedObject } from '../../core/utils/json';
import {
    getCrossHighlightFieldBaseMeasureName,
    getSanitisedTooltipValue,
    isCrossHighlightComparatorField,
    isCrossHighlightField,
    isCrossHighlightStatusField,
    TDataPointHighlightComparator,
    TDataPointHighlightStatus,
    TDataPointSelectionStatus
} from '../interactivity';
import { DATA_TABLE_FONT_FAMILY, DATA_TABLE_FONT_SIZE } from '.';
import { getI18nValue } from '../i18n';

/**
 * This sets the StackItem for the table to the correct positioning for
 * Tabulator.
 */
export const dataTableStackItemStyles: Partial<IStackItemStyles> = {
    root: { position: 'relative' }
};

/**
 * If the column/cell relates to cross-filtering, return a tooltip value that
 * is contextual for the displayed value.
 */
const getCellCrossFilterTooltip = (value: TDataPointSelectionStatus) => {
    switch (value) {
        case 'neutral':
            return getI18nValue('Pivot_Debug_SelectedNeutral');
        case 'on':
            return getI18nValue('Pivot_Debug_SelectedOn');
        case 'off':
            return getI18nValue('Pivot_Debug_SelectedOff');
    }
};

/**
 * For a given column, checks for any special conditions and returns a
 * customized tooltip for the current cell.
 */
export const getCellTooltip = (field: string, value: any) => {
    switch (true) {
        case field === DATASET_SELECTED_NAME:
            return getCellCrossFilterTooltip(value);
        case isCrossHighlightComparatorField(field):
            return getCellHighlightComparatorTooltip(value);
        case isCrossHighlightStatusField(field):
            return getCellHighlightComparatorStatus(value);
        case isValuePlaceholderComplex(value):
            return getI18nValue('Table_Tooltip_TooLong');
        case isDate(value):
            return new Date(value).toUTCString();
        case isNumber(value):
            return formatNumberValueForTable(value);
        case isFunction(value):
            return value.toString();
        default:
            return getSanitisedTooltipValue(value);
    }
};

/**
 * If the column/cell relates to a cross-highlight status, return a tooltip
 * value that is contextual for the displayed value.
 */
const getCellHighlightComparatorStatus = (value: TDataPointHighlightStatus) => {
    switch (value) {
        case 'neutral':
            return getI18nValue('Pivot_Debug_HighlightStatusNeutral');
        case 'on':
            return getI18nValue('Pivot_Debug_HighlightStatusOn');
        case 'off':
            return getI18nValue('Pivot_Debug_HighlightStatusOff');
    }
};

/**
 * If the column/cell relates to a cross-highlight comparator, return a tooltip
 * value that is contextual for the displayed value.
 */
const getCellHighlightComparatorTooltip = (
    value: TDataPointHighlightComparator
) => {
    switch (value) {
        case 'eq':
            return getI18nValue('Pivot_Debug_HighlightComparatorEq');
        case 'lt':
            return getI18nValue('Pivot_Debug_HighlightComparatorLt');
        case 'gt':
            return getI18nValue('Pivot_Debug_HighlightComparatorGt');
        case 'neq':
            return getI18nValue('Pivot_Debug_HighlightComparatorNeq');
    }
};

/**
 * For a given column, checks for any special conditions and returns a
 * customized tooltip for the column header.
 */
export const getColumnHeaderTooltip = (column: string) => {
    switch (true) {
        case isTableColumnNameReserved(column):
            return getReservedTableColumnTooltip(column);
        case isCrossHighlightComparatorField(column):
            return getI18nValue('Pivot_Dataset_HighlightComparatorField', [
                getCrossHighlightFieldBaseMeasureName(column),
                getI18nValue('Pivot_Debug_HighlightComparatorEq'),
                getI18nValue('Pivot_Debug_HighlightComparatorLt'),
                getI18nValue('Pivot_Debug_HighlightComparatorGt'),
                getI18nValue('Pivot_Debug_HighlightComparatorNeq'),
                getI18nValue('Pivot_Debug_Refer_Documentation')
            ]);
        case isCrossHighlightStatusField(column):
            return getI18nValue('Pivot_Dataset_HighlightStatusField', [
                getCrossHighlightFieldBaseMeasureName(column),
                getI18nValue('Pivot_Debug_HighlightStatusNeutral'),
                getI18nValue('Pivot_Debug_HighlightStatusOn'),
                getI18nValue('Pivot_Debug_HighlightStatusOff'),
                getI18nValue('Pivot_Debug_Refer_Documentation')
            ]);
        case isCrossHighlightField(column):
            return getI18nValue('Pivot_Dataset_HighlightField', [
                getCrossHighlightFieldBaseMeasureName(column)
            ]);
        default:
            return column;
    }
};

/**
 * When posting to the web worker, we need to ensure that our dataset is
 * suffciently pruned to avoid any issues with cyclic references, or properties
 * that can cause issues with serialization.
 */
export const getDatasetForWorker = (dataset: any[]) => gwtPrunedObject(dataset);

/**
 * We need to measure how much space a table value (and heading) will take up
 * in the UI, so that we can pre-calculate the width of each column. This is
 * computationally expensive, to do by value, so with a monospace font, we can
 * measure this once, and project by the number of characters in the supplied
 * value. This method measures the width of a single character, based on font
 * size and family.
 */
export const getDataTableRenderedCharWidth = () => {
    const canvas = new OffscreenCanvas(100, 10);
    const ctx: OffscreenCanvasRenderingContext2D = <any>canvas.getContext('2d');
    ctx.font = `${DATA_TABLE_FONT_SIZE}px ${DATA_TABLE_FONT_FAMILY}`;
    return ctx.measureText(' ').width;
};

/**
 * Perform all i18n translations for values that need to be assigned by the
 * data table worker.
 */
export const getDataTableWorkerTranslations =
    (): IDataTableWorkerTranslations => ({
        placeholderInfinity: getI18nValue('Table_Placeholder_Infinity'),
        placeholderNaN: getI18nValue('Table_Placeholder_NaN'),
        placeholderTooLong: getI18nValue('Table_Placeholder_TooLong'),
        selectedNeutral: getI18nValue('Pivot_Debug_SelectedNeutral'),
        selectedOn: getI18nValue('Pivot_Debug_SelectedOn'),
        selectedOff: getI18nValue('Pivot_Debug_SelectedOff'),
        selectionKeywordPresent: getI18nValue('Selection_KW_Present')
    });

/**
 * If a column name is a reserved word, then supply a suitable tooltip value.
 */
const getReservedTableColumnTooltip = (field: string) => {
    switch (true) {
        case field === DATASET_SELECTED_NAME:
            return getI18nValue('Pivot_Dataset_SelectedName', [
                field,
                getI18nValue('Pivot_Debug_SelectedNeutral'),
                getI18nValue('Pivot_Debug_SelectedOn'),
                getI18nValue('Pivot_Debug_SelectedOff'),
                getI18nValue('Pivot_Debug_Refer_Documentation')
            ]);
        default:
            return getI18nValue(
                `Pivot_Dataset_${
                    field === DATASET_ROW_NAME
                        ? 'RowIdentifier'
                        : field === DATASET_IDENTITY_NAME
                        ? 'IdentityName'
                        : 'Unknown'
                }`,
                [field]
            );
    }
};

/**
 * Handle the display and translation of number values for a table. Borrowed
 * and adapted from vega-editor.
 */
const formatNumberValueForTable = (value: number, tooltip = false) =>
    isNaN(value)
        ? getI18nValue('Table_Placeholder_NaN')
        : value === Number.POSITIVE_INFINITY
        ? getI18nValue('Table_Placeholder_Infinity')
        : value === Number.NEGATIVE_INFINITY
        ? `-${getI18nValue('Table_Placeholder_Infinity')}`
        : getStringifiedDisplayValue(value, tooltip);

/**
 * Handle the processing of a stringified value within a data table.
 */
const getStringifiedDisplayValue = (value: any, tooltip = false) => {
    const pruned = gwtPrunedObject(value);
    return tooltip ? getSanitisedTooltipValue(pruned) : pruned;
};

/**
 * Determines whether a supplied value matches one of the 'placeholder' values
 * for a table cell.
 */
const isValuePlaceholderComplex = (value: string) =>
    value === getI18nValue('Table_Placeholder_TooLong') ||
    value === getI18nValue('Table_Placeholder_Object') ||
    value === getI18nValue('Table_Placeholder_Circular') ||
    false;

/**
 * For a given column value, determine if it's in the list of 'reserved' words
 * that should be processed differently.
 */
const isTableColumnNameReserved = (value: string) =>
    TABLE_COLUMN_RESERVED_WORDS.indexOf(value) > -1;
