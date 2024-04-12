import { Menu } from '@headlessui/react'
import { useEditorStore } from '../../store/editor.store'
import { useRef } from 'react'
import { TbCheck, TbChevronDown } from 'react-icons/tb'
import { FaRegStickyNote } from "react-icons/fa";

export function EditorSelect(): JSX.Element {
  const { currentNoteID, getNote, notes, setCurrentNoteID, updateNoteTitle, addNote } =
    useEditorStore()

  const invisibleSpanRef = useRef<HTMLSpanElement>(null)

  return (
    <Menu as="div" className="relative">
      <div className="flex items-center px-2 gap-2">
        <span ref={invisibleSpanRef} className="opacity-0 h-0 text-sm pointer-events-none absolute" />
        <input
          type="text"
          defaultValue={getNote(currentNoteID)?.title || 'Sem título'}
          className="bg-transparent text-accent text-sm outline-none min-w-10 max-w-60"
          key={currentNoteID}
          onChange={(e) => updateNoteTitle(currentNoteID, e.currentTarget.value)}
          ref={(ref) => {
            if (!ref) return
            if (!invisibleSpanRef.current) return
            invisibleSpanRef.current.textContent = ref.value
            ref.style.width = `${invisibleSpanRef.current.offsetWidth}px`
          }}
        />
        <Menu.Button className="pt-[2px]">
          <TbChevronDown className="hover:scale-110 transition-all" />
        </Menu.Button>
      </div>
      <Menu.Items className="absolute left-0 w-40 bg-highlight border border-accent/20 mt-3 z-30 origin-top-right overflow-hidden rounded-md shadow-lg focus:outline-none">
        <div className='max-h-56 overflow-y-auto'>
          {notes.map((note) => (
            <Menu.Item key={note.id}>
              <button
                onClick={() => setCurrentNoteID(note.id)}
                className="flex hover:bg-accent/10 items-center w-full px-2.5 gap-2 py-2 text-sm justify-between text-accent transition-all"
              >
                <span className="line-clamp-1 text-left">{note.title || `Sem título`}</span>
                {note.id === currentNoteID && <TbCheck className="min-w-4" />}
              </button>
            </Menu.Item>
          ))}
        </div>
        <Menu.Item>
          <button
            onClick={addNote}
            className="flex items-center hover:bg-accent/10 border-t gap-1.5 border-t-accent/20 w-full px-2.5 py-2 text-sm text-accent"
          >
            <FaRegStickyNote className='pt-px' />
            Nova nota
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
