import React from 'react';

import { Stack } from '@fluentui/react/lib/Stack';

import { ExportVisualDataFields } from './ExportVisualDataFields';
import { Assistive } from '../../../components/elements/Typography';
import {
    TEMPLATE_PICKER_STACK_STYLES,
    TEMPLATE_PICKER_NON_SHRINKING_STACK_ITEM_STYLES,
    TEMPLATE_EXPORT_INFO_STACK_TOKENS
} from '../../template';
import { getI18nValue } from '../../i18n';

export const ExportVisualDatasetPane: React.FC = () => (
    <Stack
        styles={TEMPLATE_PICKER_STACK_STYLES}
        tokens={TEMPLATE_EXPORT_INFO_STACK_TOKENS}
    >
        <Stack.Item>
            <Assistive>
                {getI18nValue('Template_Export_Dataset_Assistive')}
            </Assistive>
        </Stack.Item>
        <Stack.Item
            grow={3}
            styles={TEMPLATE_PICKER_NON_SHRINKING_STACK_ITEM_STYLES}
        >
            <>
                <ExportVisualDataFields />
            </>
        </Stack.Item>
    </Stack>
);
