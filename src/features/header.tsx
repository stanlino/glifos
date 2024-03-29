import { useCallback, useReducer } from 'react'
import { TbPinned, TbPinnedFilled, TbPlus } from 'react-icons/tb'
import { ColorPicker } from '../components/color-picker'
import { useEditorStore } from '../store/editor.store'
import { EditorsDropdown } from './editors-dropdown'
import { invoke, window as w } from '@tauri-apps/api'

export function Header(): JSX.Element {
  const [windowPinned, toggleWindowPin] = useReducer((state: boolean) => !state, false)
  const { addNote, notes } = useEditorStore()

  const handleToggleWindowPin = useCallback(() => {
    w.getCurrent().setAlwaysOnTop(!windowPinned)
    toggleWindowPin()
    invoke('update_always_on_top_state')
  }, [windowPinned])

  return (
    <header data-tauri-drag-region className="bg-white bg-opacity-30 text-custom-text h-9 px-2 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        {notes.length > 1 && <EditorsDropdown />}
        {notes.length <= 1 && (
          <button
            onClick={addNote}
            className="w-6 items-center flex justify-center hover:scale-110 transition-all"
          >
            <TbPlus />
          </button>
        )}
      </div>
      <div className="flex gap-2 px-1">
        <ColorPicker />
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
