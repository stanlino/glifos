import { useRef } from "react"
import { useEditorStore } from "../../store/editor.store"

export function HeaderNoteTitle() {
  const { currentNoteID, getNote, updateNoteTitle } = useEditorStore()

  const invisibleSpanRef = useRef<HTMLSpanElement>(null)

  return (
    <input
      type="text"
      defaultValue={getNote(currentNoteID)?.title || 'Sem título'}
      className="bg-transparent text-accent text-sm outline-none min-w-10 max-w-60 text-center"
      key={currentNoteID}
      onChange={(e) => updateNoteTitle(currentNoteID, e.currentTarget.value)}
      ref={(ref) => {
        if (!ref) return
        if (!invisibleSpanRef.current) return
        invisibleSpanRef.current.textContent = ref.value
        ref.style.width = `${invisibleSpanRef.current.offsetWidth}px`
      }}
    />
  )
}