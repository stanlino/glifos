import { useEffect } from "react";

export function useDisableContextMenu() {
  useEffect(() => {
    document.addEventListener('contextmenu', event => event.preventDefault());

    return () => {
      document.removeEventListener('contextmenu', event => event.preventDefault());
    }
  }, [])
}