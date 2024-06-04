import { FaLayerGroup } from "react-icons/fa"

interface DrawerButtonProps {
  toggleDrawer: () => void
}

export function NotesDrawerButton({ toggleDrawer }: DrawerButtonProps) {
  return (
    <button
      onClick={toggleDrawer}
      className="w-6 items-center outline-none flex justify-center text-accent/75 hover:scale-110 hover:text-accent transition-all"
    >
      <FaLayerGroup />
    </button>
  )
}