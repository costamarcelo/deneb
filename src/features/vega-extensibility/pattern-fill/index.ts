import { IPatternFillDefinition } from '../types';
import { select, Selection } from 'd3-selection';
import { bindPatternAttrs } from './bindings';
import {
    getPackagedFillPatternDefs,
    resolveFillPatternDefValues
} from './registry';

let defsContainer: Selection<SVGDefsElement, unknown, HTMLElement, any>;
let defsRegistry: IPatternFillDefinition[] = [];

const PATTERN_FILL_CONTAINER_ID = 'denebFillPatterns';
export const PATTERN_FILL_DEFAULT_STROKE_COLOR = '#000000';
export const PATTERN_FILL_DEFAULT_FILL_COLOR = 'transparent';
export const PATTERN_FILL_DEFAULT_STROKE_WIDTH = 1;
export const PATTERN_FILL_DEFAULT_SIZE = 10;

/**
 * Use to bind the fill pattern services to this API for use in the application
 * lifecycle.
 *
 * PATTERN FILL SERVICES WILL NOT BE ACCESSIBLE UNLESS THIS IS BOUND.
 */
export const VegaPatternFillServices = {
    bind: () => {
        defsContainer = initializePatternFillDefsContainer();
        defsRegistry = getPackagedFillPatternDefs();
        joinPatternFillData();
    },
    update: () => {
        joinPatternFillData();
    }
};
Object.freeze(VegaPatternFillServices);

/**
 * Adds a pattern fill definition to the registry.
 */
const addPatternFillDefinition = (def: IPatternFillDefinition) =>
    defsRegistry.push(def);

/**
 * Intended to be used from an `ExpressionRef` in Vega/Vega-Lite. Generate a
 * pattern ID for supplied id/stroke/fill combination, check registry for it,
 * and add an overloaded version of an OOB pattern def if not. This ID can then
 * be referenced by a spec and can be used to produce more colorful patterns in
 * lieu of greyscale ones.
 */
export const generateDynamicPatternFill = (
    id: string,
    fgColor: string = PATTERN_FILL_DEFAULT_STROKE_COLOR,
    bgColor: string = PATTERN_FILL_DEFAULT_FILL_COLOR
) => {
    const modId = encodeURI(
        `${id}-${fgColor}-${bgColor}`.replace(/[^a-zA-Z0-9-_-]+/g, '-')
    );
    const found = defsRegistry?.findIndex((fpd) => fpd.id === modId) > -1;
    const template = defsRegistry?.find((fdp) => fdp.id === id);
    if (!found && template) {
        addPatternFillDefinition(
            resolveFillPatternDefValues({
                ...template,
                ...{
                    id: modId,
                    fgColor,
                    bgColor,
                    group: 'dynamic'
                }
            })
        );
    }
    return `url(#${modId})`;
};

/**
 * Creates the SVG element for the fill pattern container and binding of
 * pattern defs within it.
 */
const initializePatternFillDefsContainer = () => {
    const svg = select('body')
        .append('svg')
        .attr('height', 0)
        .attr('width', 0)
        .attr('id', PATTERN_FILL_CONTAINER_ID)
        .style('display', 'block');
    return svg.append('defs');
};

/**
 * Joins the packaged pattern fill data to the defs container. Only needs to be
 * run once per visual instance.
 */
const joinPatternFillData = () => {
    defsContainer
        .selectAll('pattern')
        .data(defsRegistry)
        .join((enter) => enter.append('pattern').call(bindPatternAttrs));
};
