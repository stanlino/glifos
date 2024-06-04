import { Editor } from './components/note-editor/note-editor.component'
import { Header } from './components/header/header.component'
import { invoke } from '@tauri-apps/api'
import { useDisableContextMenu } from './hooks/use-disable-context-menu'
import { useUpdater } from './hooks/use-updater'
import { useTauriEvents } from './hooks/use-tauri-events.hook'

const onMouseDown = () => invoke('ignore_unfocus_for_a_second')

function App(): JSX.Element {
  useDisableContextMenu()
  useUpdater()
  useTauriEvents()

  return (
    <div onMouseDown={onMouseDown} className="w-screen h-screen">
      <div className="flex flex-col h-full">
        <Header />
        <Editor />
      </div>
    </div>
  )
}

export default App
