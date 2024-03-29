import { DefaultColors } from 'tailwindcss/types/generated/colors'
import twColors from 'tailwindcss/colors'

type ExcludedColors =
  | 'current'
  | 'inherit'
  | 'transparent'
  | 'lightBlue'
  | 'warmGray'
  | 'trueGray'
  | 'coolGray'
  | 'blueGray'
  | 'stone'
  | 'gray'
  | 'slate'
  | 'zinc'
  | 'white'
  | 'black'

const excludedColors: ExcludedColors[] = [
  'current',
  'inherit',
  'transparent',
  'lightBlue',
  'warmGray',
  'trueGray',
  'coolGray',
  'blueGray',
  'stone',
  'gray',
  'slate',
  'zinc',
  'white',
  'black'
]

type Colors = Omit<DefaultColors, ExcludedColors>

const colors: Colors = Object.assign({}, twColors)

for (const color in twColors) {
  if (excludedColors.includes(color as ExcludedColors)) {
    delete colors[color as keyof Colors]
  }
}

const darkColors = [twColors.neutral[900], twColors.gray[800], twColors.zinc[700]]

export { colors, darkColors }
