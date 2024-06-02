import { EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextStyle from '@tiptap/extension-text-style'

import Link from '@tiptap/extension-link'

import { open } from '@tauri-apps/api/shell'
import { useEditorStore } from '../../store/editor.store'
import { ResizableImage } from '../../utils/tiptap/resizable-image'
import { Uppercase } from '../../utils/tiptap/uppercase'

interface NotePreviewProps {
  noteID: string
}

export function NotePreview({ noteID }: NotePreviewProps) {
  const { getNote } = useEditorStore()

  const editor = useEditor({
    extensions,
    content: (getNote(noteID)?.content ?? ''),
    editable: false,
    editorProps: {
      attributes: {
        class: 'text-white'
      }
    }
  })

  if (!editor) return null

  return (
    <div className="flex flex-1 flex-col gap-2 select-none preview cursor-pointer max-h-28 overflow-hidden">
      <span className="text-white font-semibold">
        {getNote(noteID)?.title ?? 'Untitled'}
      </span>
      {(getNote(noteID)?.content?.length ?? 0) > 7 && (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}

const extensions = [
  ResizableImage,
  StarterKit,
  Underline,
  TaskList,
  TaskItem,
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
