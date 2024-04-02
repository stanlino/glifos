import { Menu } from '@headlessui/react'
import { useEditorStore } from '../../store/editor.store'
import { useSettingsStore } from '../../store/settings.store'
import { darken, lighten } from 'polished'
import { useRef } from 'react'
import { TbCheck, TbChevronDown } from 'react-icons/tb'

export function EditorSelect(): JSX.Element {
  const { currentNoteID, getNote, notes, setCurrentNoteID, updateNoteTitle, addNote } =
    useEditorStore()
  const { primaryColor } = useSettingsStore()

  const invisibleSpanRef = useRef<HTMLSpanElement>(null)

  return (
    <Menu as="div" className="relative">
      <div className="flex items-center px-2 gap-2">
        <span ref={invisibleSpanRef} className="opacity-0 h-0 text-sm pointer-events-none absolute" />
        <input
          type="text"
          defaultValue={getNote(currentNoteID)?.title || 'Sem título'}
          className="bg-transparent text-custom-text text-sm outline-none min-w-10 max-w-60"
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
      <Menu.Items
        className="absolute left-0 w-36 mt-3 z-30 origin-top-right overflow-hidden rounded-md shadow-lg focus:outline-none"
        style={{ backgroundColor: lighten(0.13, primaryColor) }}
      >
        {notes.map((note) => (
          <Menu.Item key={note.id}>
            <button
              disabled={note.id === currentNoteID}
              onClick={() => setCurrentNoteID(note.id)}
              className="flex items-center w-full px-3 gap-2 py-2 hover:brightness-75 text-sm justify-between text-custom-text hover:text-white transition-all disabled:pointer-events-none"
            >
              <span className="line-clamp-1 text-left">{note.title || `Sem título`}</span>
              {note.id === currentNoteID && <TbCheck className="min-w-4" />}
            </button>
          </Menu.Item>
        ))}
        <Menu.Item>
          <button
            onClick={addNote}
            className="flex items-center w-full px-2 py-2 text-sm text-white hover:brightness-110"
            style={{ backgroundColor: darken(0.1, primaryColor) }}
          >
            Criar novo
          </button>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
