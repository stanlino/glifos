import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { useEffect } from "react";

export function useUpdater() {
  useEffect(() => {
    async function check() {
      const { shouldUpdate } = await checkUpdate()
      if (shouldUpdate) await installUpdate()
    }
    check()
  }, [])
}