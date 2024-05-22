import { SelectionMode, SpecProvider, SpecRenderMode } from '../definitions';
import { PREVIEW_PANE_DATA_TABLE } from './debug-area';

/**
 * Specifies the limits (and step size) for handling cross-filtering.
 */
export const CROSS_FILTER_LIMITS = {
    minDataPointsValue: 1,
    maxDataPointsValue: 250,
    maxDataPointsAdvancedValue: 2500,
    dataPointsStepValue: 1
};

/**
 * For a measure, this is suffixed to the column name to denote the format string.
 */
export const DATASET_FIELD_FORMAT_STRING_SUFFIX = '__format';

/**
 * For a measure, this is suffixed to the column name to denote the formatted value.
 */
export const DATASET_FIELD_FORMATED_VALUE_SUFFIX = '__formatted';

/**
 * Denotes how we suffix fields in the dataset that contain highlight values.
 */
export const HIGHLIGHT_FIELD_SUFFIX = '__highlight';

/**
 * Denotes how we suffix fields that contain the status of a highlight value, which can be used for conditional checks
 * without resorting to more complex expressions than necessary.
 */
export const HIGHLIGHT_STATUS_SUFFIX = `${HIGHLIGHT_FIELD_SUFFIX}Status`;

/**
 * Denotes how we suffix fields that contain the comparison of a highlight value to its original value, which can be
 * used for conditional checks without resorting to more complex expressions than necessary.
 */
export const HIGHLIGHT_COMPARATOR_SUFFIX = `${HIGHLIGHT_FIELD_SUFFIX}Comparator`;

/**
 * Default values for Deneb's persistable properties, matching the structure of the visual capabilities from the Power
 * BI custom visual.
 */
export const PROPERTIES_DEFAULTS = {
    developer: {
        /**
         * Locale override for testing formatting and i18n
         */
        locale: 'en-US',
        /**
         * Visual version. Used to check for updates
         */
        version: null
    },
    dataLimit: {
        /**
         * Allow override of `dataReductionAlgorithm` limit.
         */
        override: false,
        /**
         * Display information about the custom visual limitations and recommendations for end users.
         */
        showCustomVisualNotes: true
    },
    display: {
        /**
         * Color of displayed scrollbars.
         */
        scrollbarColor: '#000000',
        /**
         * Opacity of displayed scrollbars.
         */
        scrollbarOpacity: {
            min: 0,
            max: 100,
            default: 20
        },
        /**
         * Radius of displayed scrollbars.
         */
        scrollbarRadius: {
            min: 0,
            max: 3,
            default: 0
        },
        /**
         * The time between throttling scroll events
         */
        scrollEventThrottle: {
            min: 0,
            max: 1000,
            default: 5
        }
    },
    editor: {
        /**
         * Whether to pass through the visual background effects in the preview area.
         */
        backgroundPassThrough: true,
        /**
         * Number of rows to display in the debug table.
         */
        dataTableRowsPerPage: PREVIEW_PANE_DATA_TABLE.rowsPerPage.default,
        /**
         * Interval in milliseconds to debounce editor changes.
         */
        debouncePeriod: {
            default: 200,
            min: 0,
            max: 1000
        },
        /**
         * Font size for the JSON editor.
         */
        fontSize: {
            default: 10,
            min: 8,
            max: 30
        },
        /**
         * Whether to perform local completion in the JSON editor.
         */
        localCompletion: false,
        /**
         * Maximum line length for the JSON editor.
         */
        maxLineLength: 40,
        /**
         * Preferred editor position within interface.
         */
        position: 'left',
        /**
         * Show scrollbars in advanced editor preview area.
         */
        previewScrollbars: false,
        /**
         * Show the gutter in the JSON editor.
         */
        showGutter: true,
        /**
         * Show line numbers in the JSON editor.
         */
        showLineNumbers: true,
        /**
         * Show viewport marker in editor.
         */
        showViewportMarker: true,
        /**
         * Number of spaces to use for tab size in the JSON editor.
         */
        tabSize: 2,
        /**
         * The theme to use for the editor.
         */
        theme: 'light',
        /**
         * Whether to wrap text in the JSON editor or not.
         */
        wordWrap: true
    },
    stateManagement: {
        /**
         * Persisted height of visual viewport in view mode (should preserve height on re-init).
         */
        viewportHeight: null,
        /**
         * Persisted width of visual viewport in view mode (should preserve width on re-init)
         */
        viewportWidth: null
    },
    theme: {
        /**
         * Number of discrete colors to use when computing the `pbiColorOrdinal` scheme hues.
         */
        ordinalColorCount: {
            default: 10,
            min: 1,
            max: 100
        }
    },
    unitSymbols: {
        milliseconds: 'ms',
        percent: '%',
        pixels: 'px',
        pt: 'pt'
    },
    vega: {
        /**
         * Indicates whether the context menu should include Power BI selection ID functionality, which permits data
         * point-centric operations, like drillthrough, drilldown and include/exclude.
         */
        enableContextMenu: true,
        /**
         * Indicates whether a custom tooltip handler should be used, rather than Vega's inbuilt one. This currently
         * only consideres Power BI tooltips.
         */
        enableTooltips: true,
        /**
         * Whether to enable support fields in the main dataset to manage cross-filtering in Power BI, and leverage the
         * cross-filtering APIs for data points.
         */
        enableSelection: false,
        /**
         * Whether to enable support fields in the main dataset to manage highlighting in Power BI, and leverage the
         * highlighting APIs for data points.
         */
        enableHighlight: false,
        /**
         * Whether the 'create' dialog should be open or not.
         */
        isNewDialogOpen: true,
        /**
         * The JSON editor content for specification.
         */
        jsonSpec: '{}',
        /**
         * The JSON editor content for configuration.
         */
        jsonConfig: '{}',
        /**
         * The level of logging to apply to the Vega parser.
         */
        logLevel: 3,
        /**
         * The Vega provider to use when parsing.
         */
        provider: <SpecProvider>'vegaLite',
        /**
         * The default render mode.
         */
        renderMode: <SpecRenderMode>'svg',
        /**
         * Maximum number of data points to include when cross-filtering
         */
        selectionMaxDataPoints: 50,
        /**
         * The mode of selection to use for the visual.
         */
        selectionMode: <SelectionMode>'simple',
        /**
         * The delay before showing a tooltip.
         */
        tooltipDelay: 0,
        /**
         * The default version to apply for new specifications.
         */
        version: ''
    }
};

/**
 * Signals that are patched to the Vega view for Power BI integration.
 */
export const SIGNALS_POWERBI = {
    container: 'pbiContainer'
};
