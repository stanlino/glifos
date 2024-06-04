import { useSettingsStore } from '../../store/settings.store'
import { darken, lighten, parseToRgb, readableColor } from 'polished'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { TbColorFilter, TbTextSize } from 'react-icons/tb'
import { getVersion } from '@tauri-apps/api/app'
import { HexColorPicker } from "react-colorful";
import { open } from '@tauri-apps/api/shell'
import { SettingsDrawerButton } from './settings-drawer-button.component'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { SettingsDrawerHeader } from './settings-drawer-header.component copy'

export function SettingsDrawer(): JSX.Element {
  const [appVersion, setAppVersion] = useState<string | null>()

  const [drawerOpen, toggleDrawer] = useReducer((state: boolean) => !state, false)

  const { primaryColor, setPrimaryColor, fontSize, setFontSize } = useSettingsStore()

  const handleColorPicker = useCallback((color: string) => {
    const primary = parseToRgb(color)
    document.documentElement.style.setProperty('--primary-color', `${primary.red} ${primary.green} ${primary.blue}`)

    const readable = readableColor(color)
    const accent = parseToRgb(readable)
    document.documentElement.style.setProperty('--accent-color', `${accent.red} ${accent.green} ${accent.blue}`)

    const juice = readable === '#000' ? darken : lighten
    const highlight = parseToRgb(juice(0.1, color))
    document.documentElement.style.setProperty('--highlight-color', `${highlight.red} ${highlight.green} ${highlight.blue}`)

    document.documentElement.style.setProperty('--scrollbar-color', juice(0.2, color))
    
    setPrimaryColor(color)
  }, [])

  const handleSelectFontSize = useCallback((fontSize: number) => () => {
    setFontSize(fontSize)
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
  }, [])

  useEffect(() => {
    handleColorPicker(primaryColor)
    handleSelectFontSize(fontSize)()
    getVersion().then(setAppVersion)
  }, [])

  return (
    <div>
      <SettingsDrawerButton toggleDrawer={toggleDrawer} />
      <Transition show={drawerOpen}>
        <Dialog className="relative z-10" onClose={toggleDrawer}>
          <div className="fixed inset-0 bg-black/25 rounded-sm" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-1"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-1"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-60">
                    <div className="flex h-full max-h-full flex-col rounded-r-lg gap-4 bg-gradient-to-br from-neutral-800 to-neutral-900 p-4 pr-5 shadow-xl">
                      <SettingsDrawerHeader onClose={toggleDrawer} />
                      <div className='flex flex-col gap-2'>
                        <span className='text-white text-sm flex gap-1.5 items-center'>
                          <TbColorFilter /> Cor do editor
                        </span>
                        <HexColorPicker
                          color={primaryColor}
                          onChange={handleColorPicker}
                          style={{ height: 148, width: '100%' }}
                        />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <span className='text-white text-sm flex gap-1.5 items-center'>
                          <TbTextSize className='text-lg' /> Tamanho da fonte
                        </span>
                        <div className='flex gap-1 text-sm text-accent items-center text-opacity-75'>
                          <button data-checked={fontSize === 12} className='flex items-center outline-none gap-1 border flex-1 bg-neutral-700 rounded-sm border-neutral-600 justify-center py-1 data-[checked=true]:bg-neutral-500 transition-all text-white' onClick={handleSelectFontSize(12)}>
                            <span>12px</span>
                          </button>
                          <button data-checked={fontSize === 14} className='flex items-center outline-none gap-1 border flex-1 bg-neutral-700 rounded-sm border-neutral-600 justify-center py-1 data-[checked=true]:bg-neutral-500 transition-all text-white' onClick={handleSelectFontSize(14)}>
                            <span>14px</span>
                          </button>
                          <button data-checked={fontSize === 16} className='flex items-center outline-none gap-1 border flex-1 bg-neutral-700 rounded-sm border-neutral-600 justify-center py-1 data-[checked=true]:bg-neutral-500 transition-all text-white' onClick={handleSelectFontSize(16)}>
                            <span>16px</span>
                          </button>
                        </div>
                      </div>
                      <div className='flex flex-col flex-1 justify-end'>
                        <button onClick={() => open('https://github.com/stanlino/glifos')} className='flex text-xs justify-center text-white/75 items-center hover:underline hover:text-white'>
                          <span>Glifos {appVersion}</span>
                        </button>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
