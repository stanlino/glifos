import { useCallback } from "react";
import { useEditorStore } from "../../store/editor.store";
import { NotePreview } from "./note-preview.component";
import { TbArchive, TbArchiveOff } from "react-icons/tb";

interface NoteGridListProps {
  listType: 'default' | 'archived'
  toggleDrawer: () => void
}

export function NoteList({ listType, toggleDrawer }: NoteGridListProps) {
  const { notes, archivedNotes, setCurrentNoteID, archiveNote, unarchiveNote } = useEditorStore()

  const noteList = listType === 'default' ?
    notes.filter(note => !archivedNotes.includes(note.id))
    : notes.filter(note => archivedNotes.includes(note.id))

  const handleNoteClick = useCallback((noteID: string) => () => {
    setCurrentNoteID(noteID)
    toggleDrawer()
  }, [setCurrentNoteID, toggleDrawer])
    
  return (
    <div className="flex flex-1 flex-col gap-2">
      {!noteList.length && (
        <div className="flex flex-1 justify-center items-center text-white">
          <span className="text-sm text-neutral-400 pb-16">
            {listType === 'default' ? 'Suas notas aparecerão aqui.' : 'Suas notas arquivadas aparecerão aqui.'}
          </span>
        </div>
      )}
      {noteList.map((note) => (
        <div className="relative">
          <div className="absolute top-1.5 right-1.5 w-6 aspect-square rounded-sm flex bg-neutral-800 text-white transition-all hover:text-white/50">
            <button
              onClick={(event) => {
                event.stopPropagation()
                listType === 'default' ? archiveNote(note.id) : unarchiveNote(note.id)
              }}
              className="flex items-center justify-center flex-1"
            >
              {listType === 'default' ? <TbArchive className='h-4 w-4' /> : <TbArchiveOff className='h-4 w-4' />}
            </button>
          </div>
          <div
            key={note.id}
            onClick={handleNoteClick(note.id)}
            className="flex cursor-pointer border hover:bg-neutral-600 border-neutral-600 bg-neutral-700 rounded-sm items-center p-2 text-sm transition-all"
          >
            <NotePreview noteID={note.id} />
          </div>
        </div>
      ))}
    </div>
  )
}