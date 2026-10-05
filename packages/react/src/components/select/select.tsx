'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode, useState } from 'react'
import { cn } from '../../utils/cn'

const selectTriggerVariants = cva(
  'iu:group iu:inline-flex iu:w-full iu:items-center iu:justify-between iu:gap-2 iu:rounded-md iu:border iu:bg-[var(--color-field-bg)] iu:text-base iu:text-[var(--color-field-text)] iu:transition-colors iu:outline-none iu:border-[var(--color-field-border)] iu:data-[placeholder]:text-[var(--color-field-text-placeholder)] iu:hover:border-[var(--color-field-border-hover)] iu:focus-visible:border-[var(--color-field-border-hover)] iu:focus-visible:ring-2 iu:focus-visible:ring-[var(--color-field-focus-ring)] iu:data-[state=open]:border-[var(--color-field-border-hover)] iu:data-[state=open]:ring-2 iu:data-[state=open]:ring-[var(--color-field-focus-ring)] iu:disabled:cursor-not-allowed iu:disabled:bg-[var(--color-field-bg-disabled)] iu:disabled:text-[var(--color-field-text-disabled)] iu:disabled:border-[var(--color-field-border-disabled)]',
  {
    variants: {
      size: {
        lg: 'iu:h-14 iu:px-4',
        md: 'iu:h-12 iu:px-3',
        sm: 'iu:h-10 iu:px-2',
      },
      error: {
        true: 'iu:border-[var(--color-field-border-error)] iu:hover:border-[var(--color-field-border-error)] iu:focus-visible:border-[var(--color-field-border-error)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type SelectProps = Omit<VariantProps<typeof selectTriggerVariants>, 'error'> & {
  /** Opções: um ou mais `<SelectOption>`. */
  children: ReactNode
  placeholder?: string
  name?: string
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  /** Foca normalmente, mas nunca abre o dropdown — como um `<input readOnly>`. */
  readOnly?: boolean
  required?: boolean
  error?: boolean
  className?: string
  'aria-describedby'?: string
  'aria-label'?: string
}

export function Select({
  children,
  placeholder = 'Selecione...',
  size,
  error,
  disabled,
  readOnly = false,
  className,
  name,
  value,
  defaultValue,
  onValueChange,
  required,
  id,
  'aria-describedby': ariaDescribedby,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  return (
    <SelectPrimitive.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      required={required}
      disabled={disabled}
      open={readOnly ? false : uncontrolledOpen}
      onOpenChange={readOnly ? undefined : setUncontrolledOpen}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        className={cn(selectTriggerVariants({ size, error }), className)}
        aria-invalid={error || undefined}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="iu:size-4 iu:shrink-0 iu:text-[var(--color-field-text-placeholder)] iu:transition-transform iu:group-data-[state=open]:rotate-180"
          >
            <path
              d="M4 6l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="iu:z-50 iu:overflow-hidden iu:rounded-md iu:border iu:border-[var(--color-select-dropdown-border)] iu:bg-[var(--color-select-dropdown-bg)] iu:p-1 iu:shadow-md iu:w-[var(--radix-select-trigger-width)]"
        >
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export type SelectOptionProps = {
  value: string
  disabled?: boolean
  children: ReactNode
}

export function SelectOption({ value, disabled, children }: SelectOptionProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className="iu:flex iu:cursor-pointer iu:items-center iu:gap-2 iu:rounded-sm iu:px-3 iu:py-2 iu:text-base iu:text-[var(--color-select-option-text)] iu:outline-none iu:data-[highlighted]:bg-[var(--color-select-option-bg-hover)] iu:data-[state=checked]:bg-[var(--color-select-option-bg-selected)] iu:data-[disabled]:pointer-events-none iu:data-[disabled]:text-[var(--color-select-option-text-disabled)]"
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="iu:ml-auto iu:flex iu:size-4 iu:shrink-0 iu:items-center iu:justify-center">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="iu:size-4">
          <path
            d="M3 8.5 6.5 12 13 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
