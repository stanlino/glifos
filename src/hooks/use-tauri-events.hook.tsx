import { listen } from "@tauri-apps/api/event"
import { open } from "@tauri-apps/api/shell"
import { useEffect } from "react"

export function useTauriEvents() {
  useEffect(() => {
    const unlisten = listen<string>('open', (event) => {
      open(event.payload)
    })

    return () => {
      unlisten.then(f => f());
    }
  }, [])
}