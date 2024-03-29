import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  primaryColor: string
  setPrimaryColor: (primaryColor: string) => void
}

export const useSettingsStore = create<SettingsStore>(
  persist(
    (set) => ({
      primaryColor: '#121214',
      setPrimaryColor: (primaryColor): void => set({ primaryColor })
    }),
    {
      name: 'settings-store',
      getStorage: () => localStorage
    }
  ) as StateCreator<SettingsStore>
)
