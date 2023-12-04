import powerbi from 'powerbi-visuals-api';
import PrimitiveValue = powerbi.PrimitiveValue;

import { powerBiFormatValue } from '../../utils';
import { FEATURES } from '../../../config';

/**
 * Convenience check for statis of Drilldown feature flag.
 */
export const isDrilldownFeatureEnabled = () => FEATURES.data_drilldown;

/**
 * For the supplied column/value, process it into an array of all drilldown
 * values for that row. Returns a formatted array of all known values.
 */
export const resolveDrilldownComponents = (
    current: PrimitiveValue[],
    value: PrimitiveValue,
    format: string
) => {
    const formatted = powerBiFormatValue(value, format);
    return current ? [...current, formatted] : [formatted];
};

/**
 * For the supplied column/value, process it into a single string value,
 * delimited by a space, much like how core visuals might do.
 */
export const resolveDrilldownFlat = (
    current: PrimitiveValue,
    value: PrimitiveValue,
    format: string
) => {
    const formatted = powerBiFormatValue(value, format);
    return current ? `${current} ${formatted}` : formatted;
};
