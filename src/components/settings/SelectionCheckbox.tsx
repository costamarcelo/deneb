import * as React from 'react';
import { Checkbox } from '@fluentui/react/lib/Checkbox';

import store from '../../store';
import { updateBooleanProperty } from '../../core/ui/commands';

import { hostServices } from '../../core/services';
import { i18nValue } from '../../core/ui/i18n';
import { IS_CROSS_FILTER_ENABLED } from '../../features/interactivity';

const SelectionCheckbox = () => {
    const { vega } = store((state) => state.visualSettings),
        { selectionManager } = hostServices,
        handleSelection = React.useCallback(
            (ev: React.FormEvent<HTMLElement>, checked: boolean): void => {
                const value = !!checked;
                if (!value && selectionManager.hasSelection()) {
                    selectionManager.clear();
                }
                updateBooleanProperty('enableSelection', value);
            },
            []
        ),
        disabled = vega.provider !== 'vegaLite';
    return (
        IS_CROSS_FILTER_ENABLED && (
            <Checkbox
                label={i18nValue('Objects_Vega_EnableSelection')}
                checked={vega.enableSelection}
                onChange={handleSelection}
                disabled={disabled}
            />
        )
    );
};

export default SelectionCheckbox;
