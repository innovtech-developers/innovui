'use client'

import { type ChangeEvent, type ComponentProps, type ReactNode, useId, useState } from 'react'
import { cn } from '../../utils/cn'

export type SwitchProps = Omit<ComponentProps<'input'>, 'type' | 'size'> & {
  label?: ReactNode
}

export function Switch({
  label,
  className,
  id,
  checked,
  defaultChecked,
  onChange,
  ...props
}: SwitchProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  // role="switch" não herda o mapeamento automático checked→aria-checked do role
  // nativo de checkbox, então espelhamos o estado manualmente (cobre uncontrolled também).
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false)
  const isChecked = checked ?? uncontrolledChecked

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUncontrolledChecked(event.target.checked)
    onChange?.(event)
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'iu:inline-flex iu:items-center iu:gap-2.5 iu:cursor-pointer iu:has-disabled:cursor-not-allowed iu:has-disabled:opacity-60',
        className,
      )}
    >
      <span className="iu:relative iu:inline-flex iu:h-6 iu:w-11 iu:shrink-0 iu:items-center">
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          checked={isChecked}
          aria-checked={isChecked}
          onChange={handleChange}
          className="iu:peer iu:absolute iu:inset-0 iu:size-full iu:cursor-pointer iu:appearance-none iu:disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className="iu:pointer-events-none iu:absolute iu:inset-0 iu:rounded-full iu:bg-[var(--color-selection-toggle-track-off)] iu:transition-colors iu:peer-hover:bg-[var(--color-selection-toggle-track-off-hover)] iu:peer-checked:bg-[var(--color-selection-bg-selected)] iu:peer-checked:peer-hover:bg-[var(--color-selection-toggle-track-on-hover)] iu:peer-focus-visible:ring-2 iu:peer-focus-visible:ring-[var(--color-selection-focus-ring)] iu:peer-focus-visible:ring-offset-2 iu:peer-disabled:bg-[var(--color-selection-bg-disabled)]"
        />
        <span
          aria-hidden="true"
          className="iu:pointer-events-none iu:absolute iu:left-0.5 iu:size-5 iu:translate-x-0 iu:rounded-full iu:bg-[var(--color-selection-indicator-selected)] iu:shadow-sm iu:transition-transform iu:peer-checked:translate-x-5"
        />
      </span>
      {label && (
        <span className="iu:text-sm iu:text-[var(--color-selection-text-label)] iu:select-none">
          {label}
        </span>
      )}
    </label>
  )
}
