import { useOnClickOutside } from '../hooks/use-onclick-outside'
import { useSettingsStore } from '../store/settings.store'
import { colors, darkColors } from '../utils/colors'
import Github from '@uiw/react-color-github'
import { darken, lighten, readableColor } from 'polished'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TbCheck, TbSettings, TbTextSize } from 'react-icons/tb'

export function SettingsPopup(): JSX.Element {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const { primaryColor, setPrimaryColor, fontSize, setFontSize } = useSettingsStore()

  const ref = useRef<HTMLDivElement>(null)

  const handleColorPicker = useCallback((color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)
    document.documentElement.style.setProperty('--text-color', readableColor(color))
    document.documentElement.style.setProperty('--secundary-color', darken(0.2, color))
    setPrimaryColor(color)
  }, [])

  const handleSelectFontSize = useCallback((fontSize: number) => () => {
    setFontSize(fontSize)
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
  }, [])

  useEffect(() => {
    handleColorPicker(primaryColor)
    handleSelectFontSize(fontSize)()
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
        <div className="absolute z-10 top-11 p-1 right-3 rounded-lg flex gap-1 flex-col border border-custom-primary" style={{ backgroundColor: lighten(0.13, primaryColor) }}>
          <div className='flex gap-2 text-sm p-1 text-custom-text items-center text-opacity-75'>
            <TbTextSize className="text-xl" />
            <button data-checked={fontSize === 12} className='flex items-center gap-1 border flex-1 bg-white/20 rounded-md border-white/20 justify-center py-px data-[checked=true]:bg-white/50 data-[checked=true]:text-black' onClick={handleSelectFontSize(12)}>
              <span>12px</span>
            </button>
            <button data-checked={fontSize === 14} className='flex items-center gap-1 border flex-1 bg-white/20 rounded-md border-white/20 justify-center py-px data-[checked=true]:bg-white/50 data-[checked=true]:text-black' onClick={handleSelectFontSize(14)}>
              <span>14px</span>
            </button>
            <button data-checked={fontSize === 16} className='flex items-center gap-1 border flex-1 bg-white/20 rounded-md border-white/20 justify-center py-px data-[checked=true]:bg-white/50 data-[checked=true]:text-black' onClick={handleSelectFontSize(16)}>
              <span>16px</span>
            </button>
          </div>
          <Github
            colors={[...darkColors, ...Object.values(colors).map((color) => color[500])]}
            color={primaryColor}
            onChange={({ hex }) => handleColorPicker(hex)}
            rectRender={({ checked, color, onClick }) => (
              <div
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: color,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={onClick}
              >
                <TbCheck className="text-custom-text text-lg" style={{ display: checked ? 'block' : 'none' }} />
              </div>
            )}
            className="max-w-48"
            placement={'' as unknown as undefined}
            style={{ width: 175, border: 'none', borderRadius: 4, overflow: 'hidden', padding: 0 }}
          />
        </div>
      )}
    </div>
  )
}
