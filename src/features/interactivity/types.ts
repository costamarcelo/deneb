import powerbi from 'powerbi-visuals-api';
import ISelectionId = powerbi.visuals.ISelectionId;
import { SelectionMode } from '@deneb-viz/core-dependencies';

/**
 * Optins that can be supplied for advanced cross-filtering behavior.
 */
export type CrossFilterOptions = {
    /**
     * The type of filtering mode that we wish to apply
     */
    mode: SelectionMode;
    /**
     * Valid Vega expression to apply to the original dataset, in order to create a shortlist of data points to add to
     * the list of identities. The filter can contain a token in the format `_{fieldName}_` which represents the
     * corresponding field name from the current event's datum and can be used to reduce the amount of escaping needed
     * in the supplied expression. Or escape it. Or even mix them. You do you.
     */
    filterExpr?: string;
    /**
     * The maximum number of identities to return. If not supplied, the default limit will be used. This will also be
     * validated as between the current threshold values as defined in config (and similarly is a constraint for
     * simple filtering).
     */
    limit?: number;
    /**
     * Keys that should permit multi-select behavior. If not supplied, the default keys will be used.
     */
    multiSelect?: MultiSelectKey[];
};

/**
 * Specifies the internal result of a cross-filter operation, delegation to the visdual host, and any warnings that
 * may have been generated.
 */
export type CrossFilterResult = {
    /**
     * The identities that should be applied to the visual host.
     */
    identities: ISelectionId[];
    /**
     * Any warnings that should be displayed to the user in the logging pane.
     */
    warning?: string;
};

/**
 * Indicates how a cross-highlight value compares with its original (base)
 * value.
 */
export type TDataPointHighlightComparator = 'lt' | 'eq' | 'gt' | 'neq';

/**
 * Indicates the internal highlight state of a data field. This currently just
 * mirrors `TDataPointSelectionStatus` but is declared here for future-proofing
 * purposes.
 */
export type TDataPointHighlightStatus = TDataPointSelectionStatus;

/**
 * Indicates the internal selection state of a data point.
 */
export type TDataPointSelectionStatus = 'off' | 'neutral' | 'on';

/**
 * Define which keys should invoke multi-select behavior (for advanced cross-filtering).
 */
export type MultiSelectKey = 'ctrl' | 'shift' | 'alt';

/**
 * Used to denote supported interactivity types within Deneb. These can be used
 * to flag any contextual methods for any particular functionality.
 */
export type TInteractivityType = 'tooltip' | 'highlight' | 'select' | 'context';
