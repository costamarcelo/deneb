import React from 'react';

import store from '../../../store';
import { JsonEditor } from './json-editor';
import { logRender } from '../../logging';
import { SettingsPane } from '../../settings';
import { TEditorRole } from '../types';

interface IEditorOperationContainerProps {
    operation: TEditorRole;
}

export const EditorOperationContainer: React.FC<IEditorOperationContainerProps> =
    ({ operation }) => {
        const { editorSelectedOperation } = store((state) => state);
        const visible = editorSelectedOperation === operation;
        const editorPane = operation !== 'Settings';
        logRender('EditorOperationContainer', operation);
        return (
            <div
                className={`editor-pane-container ${
                    (!editorPane && 'Settings') || ''
                }`}
                style={{
                    display: visible ? 'inherit' : 'none'
                }}
            >
                {editorPane ? (
                    <JsonEditor thisEditorRole={operation} />
                ) : (
                    <SettingsPane />
                )}
            </div>
        );
    };
