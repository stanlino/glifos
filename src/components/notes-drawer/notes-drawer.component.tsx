import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useReducer } from 'react'
import { NotesDrawerHeader } from './notes-drawer-header.component';
import { NotesDrawerButton } from './notes-drawer-button.component';
import { useEditorStore } from '../../store/editor.store';
import { TbPlus } from 'react-icons/tb';
import { NoteListHeader } from '../note-list/note-list-header.component';
import { NoteList } from '../note-list/note-list.component';

export function NotesDrawer(): JSX.Element {
  const { addNote, notes } = useEditorStore()

  const [open, toggleDrawer] = useReducer((state: boolean) => !state, false)
  const [listType, toggleListType] = useReducer((state: 'default' | 'archived') => state === 'default' ? 'archived' : 'default', 'default')

  return (
    <nav className="flex gap-2 items-center">
      {notes.length > 1 && <NotesDrawerButton toggleDrawer={toggleDrawer} />}
      {notes.length < 2 && (
        <button
          onClick={addNote}
          className="w-6 items-center flex justify-center hover:scale-110 transition-all"
        >
          <TbPlus />
        </button>
      )}
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={toggleDrawer}>
          <div className="fixed inset-0 bg-black/25 rounded-sm" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="-translate-x-full"
                  enterTo="-translate-x-1"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="-translate-x-1"
                  leaveTo="-translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-screen-xs">
                    <div className="flex h-full max-h-full flex-col rounded-l-lg bg-gradient-to-br from-neutral-800 to-neutral-900 p-4 pl-5 shadow-xl">
                      <NotesDrawerHeader onClose={toggleDrawer} />
                      <div className="flex-col flex flex-1 mt-3 gap-3">
                        <NoteListHeader listType={listType} toggleListType={toggleListType} toggleDrawer={toggleDrawer} />
                        <div className='relative flex flex-1'>
                          <div className='absolute top-0 bottom-0 left-0 right-0 flex overflow-y-auto pr-0'>
                            <NoteList listType={listType} toggleDrawer={toggleDrawer} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </nav>
  )
}