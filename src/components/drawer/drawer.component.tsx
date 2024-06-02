import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useReducer, useState } from 'react'
import { FaRegStickyNote } from 'react-icons/fa';
import { DrawerHeader } from './drawer-header.component';
import { NoteList } from '../note/note-grid-list.component';
import { NoteGridListHeader } from '../note/note-grid-list-header.component';

export function Drawer(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [listType, toggleListType] = useReducer((state: 'default' | 'archived') => state === 'default' ? 'archived' : 'default', 'default')

  return (
    <nav>
      <div>
        <button
          onClick={() => setOpen(true)}
          className="w-6 items-center outline-none flex justify-center hover:scale-110 transition-all"
        >
          <FaRegStickyNote />
        </button>
      </div>
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0 bg-black/25 rounded-lg" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="-translate-x-full"
                  enterTo="-translate-x-px"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-screen-xs">
                    <div className="flex h-full max-h-full flex-col rounded-l-lg bg-gradient-to-br from-neutral-800 to-neutral-900 p-4 shadow-xl">
                      <DrawerHeader onClose={() => setOpen(false)} />
                      <div className="flex-col flex flex-1 mt-3 gap-3">
                        <NoteGridListHeader listType={listType} toggleListType={toggleListType} toggleDrawer={() => setOpen(false)} />
                        <div className='relative flex flex-1'>
                          <div className='absolute top-0 bottom-0 left-0 right-0 flex overflow-y-auto pr-0'>
                            <NoteList listType={listType} toggleDrawer={() => setOpen(false)} />
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