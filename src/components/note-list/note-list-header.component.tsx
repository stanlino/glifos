import { TbArchive, TbArchiveOff, TbPlus } from "react-icons/tb"
import { useEditorStore } from "../../store/editor.store"
import { useCallback } from "react"

interface NoteGridListHeaderProps {
  listType: 'default' | 'archived'
  toggleListType: () => void
  toggleDrawer: () => void
}

export function NoteListHeader({ listType, toggleListType, toggleDrawer }: NoteGridListHeaderProps) {
  const addNote = useEditorStore(store => store.addNote)

  const handleAddNote = useCallback(() => {
    addNote()
    toggleDrawer()
  }, [addNote, toggleDrawer])

  return (
    <div data-type={listType} className="flex justify-end data-[type=default]:justify-between">
      {listType === 'default' && (
        <button
          onClick={handleAddNote}
          className="flex items-center font-medium bg-neutral-700 hover:bg-neutral-600 border-neutral-600 border transition-all rounded-sm px-3 gap-2 h-8 p-1.5 text-sm text-white"
        > 
          Nova nota
          <TbPlus className='h-4 w-4 pt-px' />
        </button>
      )}
      {listType === 'default' && (
        <button
          onClick={toggleListType}
          className="flex items-center text-white rounded-sm bg-neutral-700 hover:bg-neutral-600 border-neutral-600 border transition-all aspect-square h-8 justify-center text-sm"
        >
          <TbArchive className='h-5 w-5' />
        </button>
      )}
      {listType === 'archived' && (
        <button
          onClick={toggleListType}
          className="flex items-center text-white rounded-sm bg-neutral-700 hover:bg-neutral-600 border-neutral-600 border transition-all aspect-square h-8 justify-center text-sm"
        >
          <TbArchiveOff className='h-5 w-5' />
        </button>
      )}
    </div>
  )
}