import {
  TbBold,
  TbItalic,
  TbLetterCaseUpper,
  TbList,
  TbListCheck,
  TbStrikethrough,
  TbTrash,
  TbUnderline,
  TbX
} from 'react-icons/tb'
import { EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'

import { EditorButton } from './note-editor-tool-button.component'
import Link from '@tiptap/extension-link'
import { useEditorStore } from '../../store/editor.store'
import { Fragment, useEffect, useState } from 'react'
import { ResizableImage } from '../../utils/tiptap/resizable-image'
import { Uppercase } from '../../utils/tiptap/uppercase'
import { Menu } from '@headlessui/react'
import { resetEditorContent } from '../../utils/tiptap/reset-editor'
import { open } from '@tauri-apps/api/shell'

export function Editor(): JSX.Element | null {
  const { currentNoteID, getNote, updateNoteContent, deleteNote, notes } = useEditorStore()

  const [deleteButtomEnabled, setDeleteButtonEnabled] = useState(false)

  const editor = useEditor({
    extensions,
    content: getNote(currentNoteID)?.content ?? '',
    editorProps: {
      attributes: {
        class: 'w-screen p-4 h-full outline-none text-accent'
      }
    },
    onUpdate({ editor }) {
      updateNoteContent(currentNoteID, editor.getHTML())
    }
  })

  useEffect(() => {
    const onNoteChange = () => {
      if (!editor) return
      resetEditorContent(editor, getNote(currentNoteID)?.content ?? '')
    }

    onNoteChange()
  }, [currentNoteID])

  if (!editor) return null

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden">
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
            onClick={() => editor.chain().focus().toggleUppercase().run()}
            data-active={editor.isActive('textStyle', { uppercase: true })}
          >
            <TbLetterCaseUpper />
          </EditorButton>
          <Menu as="div" className="relative">
            <Menu.Button as="div">
              <EditorButton
                data-active={editor.isActive('bulletList') || editor.isActive('taskList')}
              >
                {editor.isActive('taskList') ? <TbListCheck /> : <TbList />}
              </EditorButton>
            </Menu.Button>
            <Menu.Items className="absolute z-10 bg-highlight -bottom-2 p-2 -right-2 rounded-md flex-col shadow-lg flex gap-2">
              <Menu.Item as={Fragment}>
                <EditorButton
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  data-active={editor.isActive('taskList')}
                >
                  <TbListCheck />
                </EditorButton>
              </Menu.Item>
              <Menu.Item as={Fragment}>
                <EditorButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  data-active={editor.isActive('bulletList')}
                >
                  <TbList />
                </EditorButton>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
        {notes.length > 1 && (
          <EditorButton onClick={() => setDeleteButtonEnabled(true)}>
            <TbTrash />
          </EditorButton>
        )}
        {deleteButtomEnabled && (
          <div onClick={() => setDeleteButtonEnabled(false)} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div 
              className="p-5 pr-7 relative rounded-md flex gap-4 flex-col font-medium bg-highlight"
            >
              <button
                onClick={() => setDeleteButtonEnabled(false)}
                className="absolute -top-2 -right-2 bg-primary p-1 rounded-full hover:scale-110 transition-all flex items-center justify-center"
              >
                <TbX className='mb-px' />
              </button>
              <button
                onClick={() => {
                  deleteNote(currentNoteID)
                  setDeleteButtonEnabled(false)
                }}
                className="text-accent text-sm flex gap-1 items-center hover:text-accent hover:underline"
              >
                <TbTrash className='mb-px' />
                Excluir nota
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
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'underline cursor-pointer text-accent hover:text-accent/50 transition-all',
      onclick: (event: any) => {
        open(event.target.href)
      }
    }
  }),
  TextStyle,
  Uppercase
]
