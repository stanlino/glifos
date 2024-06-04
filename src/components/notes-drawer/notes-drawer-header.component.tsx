import { DialogTitle } from "@headlessui/react";
import { FaStickyNote } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface DrawerHeaderProps {
  onClose: () => void
}

export function NotesDrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <div data-tauri-drag-region className="flex select-none items-start justify-between">
      <DialogTitle className="text-base font-semibold flex gap-2 items-center leading-6 text-white">
        <FaStickyNote className='h-5 w-5 text-yellow-200' />
        Glifos
      </DialogTitle>
      <div className="flex h-7 items-center">
        <button
          type="button"
          className="relative rounded-md text-white hover:scale-125 transition-all outline-none focus:outline-none"
          onClick={onClose}
        >
          <MdClose className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}