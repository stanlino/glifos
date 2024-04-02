import { Editor } from './features/editor/editor'
import { Header } from './components/header'

function App(): JSX.Element {
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
