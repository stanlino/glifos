import { useCallback, useRef, useState } from "react"
import { useEditorStore } from "../../store/editor.store"
import { BsInputCursorText } from "react-icons/bs"

export function HeaderNoteTitle() {
  const { currentNoteID, getNote, updateNoteTitle } = useEditorStore()
  const [disabled, setDisabled] = useState(true)
  const invisibleSpanRef = useRef<HTMLInputElement>(null)

  const noteTitle = getNote(currentNoteID)?.title || 'Sem título'

  const inputRef = (ref: HTMLInputElement) => {
    if (!ref) return
    if (!invisibleSpanRef.current) return
    invisibleSpanRef.current.textContent = ref.value
    ref.style.width = `${invisibleSpanRef.current.offsetWidth + 2}px`
  }

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setDisabled(true)
  }, [])

  const handleDoubleClick = useCallback(() => {
    setDisabled(false)
    document.querySelector<HTMLInputElement>('#note-title')?.focus()
  }, [])

  return (
    <div data-tauri-drag-region onDoubleClick={handleDoubleClick}>
      <span ref={invisibleSpanRef} className="opacity-0 h-0 text-sm pointer-events-none absolute">{noteTitle}</span>
      <div data-disabled={disabled} className="data-[disabled=false]:border data-[disabled=true]:pointer-events-none flex gap-2 items-center px-2 py-px border-accent/30 rounded-md">
        {!disabled && <BsInputCursorText className="text-accent/50" />}
        <input
          type="text"
          id="note-title"
          key={currentNoteID}
          disabled={disabled}
          onBlur={() => setDisabled(true)}
          autoCorrect="off"
          spellCheck="false"
          autoComplete="one-time-code"
          defaultValue={noteTitle}
          className="bg-transparent text-accent text-sm outline-none transition-all min-w-10 max-w-72 text-center disabled:pointer-events-none"
          onChange={(e) => updateNoteTitle(currentNoteID, e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          ref={inputRef}
        />
      </div>
    </div>
  )
}