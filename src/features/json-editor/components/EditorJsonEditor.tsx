import React from 'react';
import { editor } from '../../../core/services';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import { reactLog } from '../../../core/utils/reactLog';
import { stageEditorData } from '../../specification';
import IVisualEditor = editor.IVisualEditor;
import { IVisualEditorProps } from '../types';
import {
    getAssignedJsonEditor,
    handleComponentUpdate
} from '../utils-jsoneditor';

export class EditorJsonEditor extends React.Component<IVisualEditorProps> {
    private container: HTMLDivElement;
    private editor: IVisualEditor;
    constructor(props: IVisualEditorProps) {
        super(props);
        this.bindEditorElement = this.bindEditorElement.bind(this);
    }
    render() {
        reactLog('Rendering [Editor]');
        return (
            <>
                <div className='jsoneditor' ref={this.bindEditorElement} />
            </>
        );
    }

    componentDidUpdate() {
        reactLog('Rendering [Editor] - update');
        handleComponentUpdate(this.editor.jsonEditor, this.props.role);
    }

    componentDidMount() {
        this.editor = getAssignedJsonEditor(this.props.role);
        this.editor.createEditor(this.container);
    }

    componentWillUnmount() {
        stageEditorData(this.editor.role);
    }

    private bindEditorElement(element: HTMLDivElement) {
        this.container = element;
    }
}
