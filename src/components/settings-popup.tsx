import { useOnClickOutside } from '../hooks/use-onclick-outside'
import { useSettingsStore } from '../store/settings.store'
import { darken, lighten, parseToRgb, readableColor } from 'polished'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TbSettings, TbTextSize } from 'react-icons/tb'
import { getVersion } from '@tauri-apps/api/app'
import { HexColorPicker } from "react-colorful";
import { open } from '@tauri-apps/api/shell'

export function SettingsPopup(): JSX.Element {
  const [appVersion, setAppVersion] = useState<string | null>()

  const [showColorPicker, setShowColorPicker] = useState(false)
  const { primaryColor, setPrimaryColor, fontSize, setFontSize } = useSettingsStore()

  const ref = useRef<HTMLDivElement>(null)

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

  useOnClickOutside(ref, () => setShowColorPicker(false))

  return (
    <div ref={ref}>
      <button
        onClick={() => setShowColorPicker((prev) => !prev)}
        className="w-6 items-center hover:scale-110 transition-all flex justify-center"
      >
        <TbSettings />
      </button>
      {showColorPicker && (
        <div className="absolute z-10 top-11 p-1 px-2 right-3 rounded-lg flex gap-1 flex-col border border-primary bg-highlight">
          <div className='flex gap-1 text-sm py-1 text-accent items-center text-opacity-75'>
            <TbTextSize className="text-2xl text-accent mx-1" />
            <button data-checked={fontSize === 12} className='flex items-center outline-none gap-1 border flex-1 bg-accent/10 rounded-md border-primary justify-center py-1 data-[checked=true]:bg-accent/30 data-[checked=true]:scale-90 active:scale-75 transition-all text-accent' onClick={handleSelectFontSize(12)}>
              <span>12px</span>
            </button>
            <button data-checked={fontSize === 14} className='flex items-center outline-none gap-1 border flex-1 bg-accent/10 rounded-md border-primary justify-center py-1 data-[checked=true]:bg-accent/30 data-[checked=true]:scale-90 active:scale-75 transition-all text-accent' onClick={handleSelectFontSize(14)}>
              <span>14px</span>
            </button>
            <button data-checked={fontSize === 16} className='flex items-center outline-none gap-1 border flex-1 bg-accent/10 rounded-md border-primary justify-center py-1 data-[checked=true]:bg-accent/30 data-[checked=true]:scale-90 active:scale-75 transition-all text-accent' onClick={handleSelectFontSize(16)}>
              <span>16px</span>
            </button>
          </div>
          <HexColorPicker
            color={primaryColor}
            onChange={handleColorPicker}
            style={{ height: 148 }}
          />
          <button onClick={() => open('https://github.com/stanlino/glifos')} className='flex gap-2 text-xs p-1 justify-center text-accent items-center hover:underline hover:opacity-100'>
            <span>Glifos {appVersion}</span>
          </button>
        </div>
      )}
    </div>
  )
}
