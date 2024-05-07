import powerbi from 'powerbi-visuals-api';
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import { VisualFormattingSettingsModel } from '@deneb-viz/integration-powerbi';

export interface IVisualUpdateComparisonOptions {
    currentProcessingFlag: boolean;
    previousOptions: VisualUpdateOptions;
    currentOptions: VisualUpdateOptions;
    previousSettings: VisualFormattingSettingsModel;
    currentSettings: VisualFormattingSettingsModel;
}
