import { ComponentProps } from 'react'

export function EditorButton(props: ComponentProps<'button'>): JSX.Element {
  return (
    <button
      className="flex items-center justify-center hover:scale-110 transition-all w-6 h-6 text-custom-text opacity-50 text-2xl hover:opacity-75 data-[active=true]:opacity-100 outline-none"
      {...props}
    >
      {props.children}
    </button>
  )
}
