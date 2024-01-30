import React, { useEffect, useMemo, useState } from 'react';
import { TopLevelSpec } from 'vega-lite';
import { Spec } from 'vega';
import {
    Label,
    Radio,
    RadioGroup,
    RadioGroupOnChangeData,
    Subtitle2,
    useId
} from '@fluentui/react-components';

import { logRender } from '../../logging';
import { getI18nValue } from '../../i18n';
import {
    getIncludedTemplates,
    getTemplateByProviderandName
} from '../../template';
import { getState } from '../../../store';
import { useCreateStyles } from './';
import { getVegaProvideri18n, TSpecProvider } from '../../../core/vega';
import {
    getTemplateMetadata,
    getTemplateResolvedForPlaceholderAssignment
} from '@deneb-viz/template';
import { PROPERTY_DEFAULTS } from '../../../../config';
import { UsermetaTemplate } from '@deneb-viz/core-dependencies';

interface ISelectIncludedTemplateProps {
    createMode: TSpecProvider;
}

/**
 * Handles the selection of included templates for the specified create mode
 * (provider), and the dispatch of the correct information to the store for
 * subsequent components that rely upon it.
 */
export const SelectIncludedTemplate: React.FC<ISelectIncludedTemplateProps> = ({
    createMode
}) => {
    const classes = useCreateStyles();
    const templates = useMemo(() => getIncludedTemplates(), []);
    const templateList = templates[createMode];
    const templateMetadata = templateList.map(
        (t: Spec | TopLevelSpec) => t.usermeta as UsermetaTemplate
    );
    const templateOptions = useMemo(
        () =>
            templateMetadata.map(({ information }) => (
                <Radio
                    value={information.name}
                    label={information.name}
                    className={classes.radioButton}
                />
            )),
        [createMode]
    );
    const [selectedTemplate, setSelectedTemplate] = useState(
        templateMetadata[0]
    );
    const labelId = useId('label');
    const [radioValue, setRadioValue] = useState(
        selectedTemplate?.information?.name
    );
    const onTemplateSelect = (name: string) =>
        dispatchSelectedTemplate(createMode, name);
    const onChange = (
        ev: React.FormEvent<HTMLDivElement>,
        data: RadioGroupOnChangeData
    ) => {
        setRadioValue(data.value);
        onTemplateSelect(data.value);
    };
    useEffect(() => {
        onTemplateSelect(radioValue);
    }, []);
    useEffect(() => {
        setSelectedTemplate(templateMetadata[0]);
        const { name } = selectedTemplate?.information ?? { name: null };
        setRadioValue(name);
        onTemplateSelect(name);
    }, [createMode]);
    const subtitle = useMemo(
        () =>
            getI18nValue('Text_Radio_Group_Select_Template', [
                getVegaProvideri18n(createMode)
            ]),
        [createMode]
    );
    logRender('SelectIncludedTemplate', createMode);
    return (
        <div
            style={{
                display: 'grid',
                gridRowGap: 'var(--spacingVerticalS)'
            }}
        >
            <Label id={labelId}>
                <Subtitle2>{subtitle}</Subtitle2>
            </Label>
            <RadioGroup
                aria-labelledby={labelId}
                value={radioValue}
                onChange={onChange}
            >
                {templateOptions}
            </RadioGroup>
        </div>
    );
};

/**
 * Ensure that the selected template is pre-processed into candiate string
 * representations of their content, so that they can work with the JSONC APIs
 * downstream.
 */
const dispatchSelectedTemplate = (createMode: TSpecProvider, name: string) => {
    const {
        create: { setTemplate }
    } = getState();
    const template = getTemplateByProviderandName(createMode, name);
    const templateContent = JSON.stringify(template);
    const candidates = getTemplateResolvedForPlaceholderAssignment(
        templateContent,
        PROPERTY_DEFAULTS.editor.tabSize
    );
    setTemplate({
        metadata: getTemplateMetadata(templateContent),
        candidates
    });
};
