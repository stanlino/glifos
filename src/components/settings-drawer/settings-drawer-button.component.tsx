import { LuSettings2 } from "react-icons/lu"

interface SettingsDrawerButtonProps {
  toggleDrawer: () => void
}

export function SettingsDrawerButton({ toggleDrawer }: SettingsDrawerButtonProps) {
  return (
    <button
      onClick={toggleDrawer}
      className="w-6 items-center hover:scale-110 transition-all flex justify-center"
    >
      <LuSettings2 />
    </button>
  )
}