import { invoke, window as tauriWindow } from '@tauri-apps/api'
import { useCallback, useReducer } from "react"
import { TbPinned, TbPinnedFilled } from 'react-icons/tb'

export function HeaderWindowPinToggler() {
  const [windowPinned, toggleWindowPin] = useReducer((state: boolean) => !state, false)

  const handleToggleWindowPin = useCallback(() => {
    tauriWindow.getCurrent().setAlwaysOnTop(!windowPinned)
    toggleWindowPin()
    invoke('update_always_on_top_state')
  }, [windowPinned])

  return (
    <button
      onClick={handleToggleWindowPin}
      className="w-6 items-center hover:scale-110 transition-all flex justify-center"
      >
      {windowPinned ? <TbPinnedFilled /> : <TbPinned />}
    </button>
  )
}