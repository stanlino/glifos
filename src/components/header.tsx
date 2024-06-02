import { useCallback, useReducer, useRef } from 'react'
import { TbPinned, TbPinnedFilled, TbPlus } from 'react-icons/tb'
import { SettingsPopup } from './settings-popup'
import { useEditorStore } from '../store/editor.store'
import { invoke, window as w } from '@tauri-apps/api'
import { Drawer } from './drawer/drawer.component'

export function Header(): JSX.Element {
  const [windowPinned, toggleWindowPin] = useReducer((state: boolean) => !state, false)
  const { addNote, notes, currentNoteID, getNote, updateNoteTitle } = useEditorStore()

  const invisibleSpanRef = useRef<HTMLSpanElement>(null)

  const handleToggleWindowPin = useCallback(() => {
    w.getCurrent().setAlwaysOnTop(!windowPinned)
    toggleWindowPin()
    invoke('update_always_on_top_state')
  }, [windowPinned])


  return (
    <header data-tauri-drag-region className="bg-highlight text-accent h-9 px-2 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        {notes.length > 1 && <Drawer />}
        {notes.length <= 1 && (
          <button
            onClick={addNote}
            className="w-6 items-center flex justify-center hover:scale-110 transition-all"
          >
            <TbPlus />
          </button>
        )}
      </div>
      <input
        type="text"
        defaultValue={getNote(currentNoteID)?.title || 'Sem título'}
        className="bg-transparent translate-x-3 text-accent text-sm outline-none min-w-10 max-w-60 text-center"
        key={currentNoteID}
        onChange={(e) => updateNoteTitle(currentNoteID, e.currentTarget.value)}
        ref={(ref) => {
          if (!ref) return
          if (!invisibleSpanRef.current) return
          invisibleSpanRef.current.textContent = ref.value
          ref.style.width = `${invisibleSpanRef.current.offsetWidth}px`
        }}
      />
      <div className="flex gap-2 px-1">
        <SettingsPopup />
        <button
          onClick={handleToggleWindowPin}
          className="w-6 items-center hover:scale-110 transition-all flex justify-center"
        >
          {windowPinned ? <TbPinnedFilled /> : <TbPinned />}
        </button>
      </div>
    </header>
  )
}
