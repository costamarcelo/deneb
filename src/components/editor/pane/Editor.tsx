import React from 'react';
import { editor } from '../../../core/services';
import { reactLog } from '../../../core/utils/reactLog';
import { stageEditorData } from '../../../features/specification';
import getAssignedEditor = editor.getAssignedEditor;
import handleComponentUpdate = editor.handleComponentUpdate;
import IVisualEditor = editor.IVisualEditor;
import IVisualEditorProps = editor.IVisualEditorProps;

class Editor extends React.Component<IVisualEditorProps> {
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
        this.editor = getAssignedEditor(this.props.role);
        this.editor.createEditor(this.container);
    }

    componentWillUnmount() {
        stageEditorData(this.editor.role);
    }

    private bindEditorElement(element: HTMLDivElement) {
        this.container = element;
    }
}

export default Editor;
