import {
  TbBold,
  TbItalic,
  TbList,
  TbListCheck,
  TbStrikethrough,
  TbTrash,
  TbUnderline
} from 'react-icons/tb'
import { EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

import { EditorButton } from '../components/editor-button'
import Link from '@tiptap/extension-link'
import { useEditorStore } from '../store/editor.store'
import { useEffect, useState } from 'react'
import { ResizableImage } from '../utils/tiptap/resizable-image'

export function Editor(): JSX.Element | null {
  const { currentNoteID, getNote, updateNoteContent, deleteNote, notes } = useEditorStore()

  const [deleteButtomEnabled, setDeleteButtonEnabled] = useState(false)

  const editor = useEditor({
    extensions,
    content: getNote(currentNoteID)?.content ?? '',
    editorProps: {
      attributes: {
        class: 'w-screen p-4 h-full outline-none text-custom-text'
      }
    },
    onUpdate({ editor }) {
      updateNoteContent(currentNoteID, editor.getHTML())
    }
  })

  useEffect(() => {
    editor?.commands.setContent(getNote(currentNoteID)?.content ?? '')
  }, [currentNoteID])

  if (!editor) return null

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden text-sm xs:text-base">
        <EditorContent editor={editor} />
      </div>
      <div className="flex p-4 justify-between">
        <div className="flex gap-4">
          <EditorButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
          >
            <TbBold />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic')}
          >
            <TbItalic />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            data-active={editor.isActive('strike')}
          >
            <TbStrikethrough />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-active={editor.isActive('underline')}
          >
            <TbUnderline />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-active={editor.isActive('bulletList')}
          >
            <TbList />
          </EditorButton>
          <EditorButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            data-active={editor.isActive('taskList')}
          >
            <TbListCheck />
          </EditorButton>
        </div>
        {notes.length > 1 && (
          <EditorButton onClick={() => setDeleteButtonEnabled(true)}>
            <TbTrash />
          </EditorButton>
        )}
        {deleteButtomEnabled && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md flex gap-4 flex-col">
              <button
                onClick={() => {
                  deleteNote(currentNoteID)
                  setDeleteButtonEnabled(false)
                }}
                className="text-red-500 hover:text-red-600 hover:underline"
              >
                Excluir nota
              </button>
              <button 
                className="text-blue-500 hover:text-blue-600 hover:underline"
                onClick={() => setDeleteButtonEnabled(false)}
              >
                Manter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const extensions = [
  ResizableImage,
  StarterKit,
  Underline,
  TaskList,
  TaskItem,
  Placeholder.configure({
    placeholder: 'Start typing...',
    emptyEditorClass: 'text-neutral-300'
  }),
  Link,
]
