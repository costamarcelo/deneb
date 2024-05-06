import React, { useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import store from '../../../store';
import { NoTemplateMessage } from './no-template-message';
import { TemplateInformation } from './template-information';
import { logRender } from '../../logging';
import { useModalDialogStyles } from '../../modal-dialog';
import { UsermetaTemplate } from '@deneb-viz/core-dependencies';

/**
 * Displays the content for creating a specification using the selected
 * template.
 */
export const CreateFromTemplate: React.FC = () => {
    const classes = useModalDialogStyles();
    const metadata = store((state) => state.create.metadata, shallow);
    const content = useMemo(
        () => routeInformationContent(metadata),
        [metadata]
    );
    logRender('CreateFromTemplate');
    return (
        <div className={classes.paneContent}>
            <div className={classes.paneContentScrollable}>{content}</div>
        </div>
    );
};

const routeInformationContent = (createMetadata: UsermetaTemplate) => {
    if (!createMetadata || Object.keys(createMetadata || {})?.length === 0) {
        return <NoTemplateMessage />;
    }
    return <TemplateInformation />;
};
