import { useOnClickOutside } from '../hooks/use-onclick-outside'
import { useSettingsStore } from '../store/settings.store'
import { colors, darkColors } from '../utils/colors'
import Github from '@uiw/react-color-github'
import { darken, readableColor } from 'polished'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoIosColorPalette } from 'react-icons/io'

export function ColorPicker(): JSX.Element {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const { primaryColor, setPrimaryColor } = useSettingsStore()

  const ref = useRef<HTMLDivElement>(null)

  const handleColorPicker = useCallback((color: string) => {
    document.documentElement.style.setProperty('--primary-color', color)
    document.documentElement.style.setProperty('--text-color', readableColor(color))
    document.documentElement.style.setProperty('--secundary-color', darken(0.2, color))
    setPrimaryColor(color)
  }, [])

  useEffect(() => {
    handleColorPicker(primaryColor)
  }, [])

  useOnClickOutside(ref, () => setShowColorPicker(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowColorPicker(true)}
        className="w-6 items-center hover:scale-110 transition-all flex justify-center"
      >
        <IoIosColorPalette />
      </button>
      {showColorPicker && (
        <div className="absolute z-10 top-8 -right-2">
          <Github
            colors={[...darkColors, ...Object.values(colors).map((color) => color[500])]}
            color={primaryColor}
            onChange={({ hex }) => handleColorPicker(hex)}
            className="max-w-48"
            placement={'' as unknown as undefined}
            style={{ backgroundColor: darken(0.1, primaryColor), width: 188 }}
          />
        </div>
      )}
    </div>
  )
}
