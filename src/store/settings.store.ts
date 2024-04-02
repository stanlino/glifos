import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  primaryColor: string
  setPrimaryColor: (primaryColor: string) => void
  fontSize: number
  setFontSize: (fontSize: number) => void
}

export const useSettingsStore = create<SettingsStore>(
  persist(
    (set) => ({
      primaryColor: '#121214',
      setPrimaryColor: (primaryColor): void => set({ primaryColor }),
      fontSize: 16,
      setFontSize: (fontSize): void => set({ fontSize })
    }),
    {
      name: 'settings-store',
      getStorage: () => localStorage
    }
  ) as StateCreator<SettingsStore>
)
