import { Editor } from "@tiptap/core";
import { EditorState } from 'prosemirror-state';

export function resetEditorContent(editor: Editor, newContent: string) {
    editor.commands.setContent(newContent);
    const newEditorState = EditorState.create({
        doc: editor.state.doc,
        plugins: editor.state.plugins,
        schema: editor.state.schema
    });
    editor.view.updateState(newEditorState);
}