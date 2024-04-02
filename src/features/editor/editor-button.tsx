import { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

export function EditorButton(props: ComponentProps<'button'>): JSX.Element {
  return (
    <button
      className={cn("flex items-center justify-center hover:scale-110 transition-all w-4 h-4 xs:w-6 xs:h-6 text-custom-text opacity-50 text-2xl hover:opacity-75 data-[active=true]:opacity-100 outline-none", props.className)}
      {...props}
    >
      {props.children}
    </button>
  )
}
