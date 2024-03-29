import { useEffect } from 'react'
import { Editor } from './features/editor'
import { Header } from './features/header'
import { enable, isEnabled } from "tauri-plugin-autostart-api";

function App(): JSX.Element {
  useEffect(() => {
    if (!isEnabled()) enable()
  }, [isEnabled()])

  return (
    <div className="w-screen h-screen">
      <div className="flex flex-col h-full">
        <Header />
        <Editor />
      </div>
    </div>
  )
}

export default App
