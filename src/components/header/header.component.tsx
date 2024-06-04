import { SettingsDrawer } from '../settings-drawer/settings-drawer.component'
import { NotesDrawer } from '../notes-drawer/notes-drawer.component'
import { HeaderNoteTitle } from './header-note-title.component'
import { HeaderWindowPinToggler } from './header-window-pin-toggler.component'

export function Header(): JSX.Element {
  return (
    <header className="bg-highlight">
      <div data-tauri-drag-region className='flex h-9 px-2 justify-between items-center'>
        <NotesDrawer />
        <HeaderNoteTitle />
        <div className="flex gap-2">
          <SettingsDrawer />
          <HeaderWindowPinToggler />
        </div>
      </div>
    </header>
  )
}
