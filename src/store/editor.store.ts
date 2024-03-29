/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Note {
  id: string
  title?: string
  content: string
}

interface EditorStore {
  notes: Note[]
  addNote: () => void
  updateNoteContent: (id: string, content: string) => void
  updateNoteTitle: (id: string, title: string) => void
  deleteNote: (id: string) => void
  currentNoteID: string
  getNote(id: string): Note | undefined
  setCurrentNoteID(id: string): void
}

const firstNoteID = Date.now().toString()

export const useEditorStore = create<EditorStore>(
  persist(
    (set, get) => ({
      notes: [{ id: firstNoteID, content: '' }],
      currentNoteID: firstNoteID,
      addNote() {
        set((state) => {
          const id = Date.now().toString()
          return {
            ...state,
            notes: [...state.notes, { id, content: '' }],
            currentNoteID: id
          }
        })
      },
      deleteNote: (id) => {
        set((state) => {
          if (state.notes.length === 1) return state
          return {
            ...state,
            notes: state.notes.filter((note) => note.id !== id),
            currentNoteID: state.notes.find((note) => note.id !== id)!.id
          }
        })
      },
      getNote: (id) => {
        return get().notes.find((note) => note.id === id)
      },
      updateNoteContent: (id, content) => {
        set((state) => ({
          ...state,
          notes: state.notes.map((note) => (note.id === id ? { ...note, content } : note))
        }))
      },
      updateNoteTitle: (id, title) => {
        set((state) => ({
          ...state,
          notes: state.notes.map((note) => (note.id === id ? { ...note, title } : note))
        }))
      },
      setCurrentNoteID: (id) => {
        set((state) => ({
          ...state,
          currentNoteID: id
        }))
      }
    }),
    {
      name: 'editor-store-v2',
      getStorage: () => localStorage
    }
  ) as StateCreator<EditorStore>
)
