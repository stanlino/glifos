import { DialogTitle } from "@headlessui/react";
import { LuSettings2 } from "react-icons/lu";
import { MdClose } from "react-icons/md";

interface DrawerHeaderProps {
  onClose: () => void
}

export function SettingsDrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <div data-tauri-drag-region className="flex select-none items-center justify-between">
      <DialogTitle className="text-base font-semibold flex gap-2 items-center leading-6 text-white">
        <LuSettings2 className='h-5 w-5' />
        Personalizar Glifos
      </DialogTitle>
      <button
        type="button"
        className="relative rounded-md text-white hover:scale-125 transition-all outline-none focus:outline-none"
        onClick={onClose}
      >
        <MdClose className='h-5 w-5 mt-px' />
      </button>
    </div>
  )
}