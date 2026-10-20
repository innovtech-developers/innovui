'use client'

import * as Popover from '@radix-ui/react-popover'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { popStyles } from '../_shared/motion'
import { ChevronRightIcon } from '../_shared/status'
import { Input, type InputProps } from '../input'

export type ComboboxOption = {
  /** Valor guardado e enviado no formulário. */
  value: string
  /** Texto mostrado na lista e no campo; também é onde a busca procura. */
  label: string
  disabled?: boolean
}

export type ComboboxProps = Omit<
  InputProps,
  'value' | 'defaultValue' | 'onChange' | 'role' | 'type' | 'leadingIcon' | 'trailingIcon'
> & {
  options: ComboboxOption[]
  /** Valor selecionado (modo controlado). */
  value?: string
  defaultValue?: string
  /** Chamado com o `value` da opção escolhida, ou `''` se a pessoa apagar o texto. */
  onValueChange?: (value: string) => void
  /** Texto quando a busca não acha nada. */
  emptyMessage?: string
}

// busca sem distinguir maiúsculas nem acentos: "sao" acha "São Paulo"
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

const firstEnabled = (list: ComboboxOption[]) => list.findIndex((o) => !o.disabled)

function move(list: ComboboxOption[], from: number, step: 1 | -1) {
  for (let i = 1; i <= list.length; i++) {
    const next = (((from + step * i) % list.length) + list.length) % list.length
    if (!list[next]?.disabled) return next
  }
  return -1
}

/**
 * Campo de texto com lista de opções filtrada enquanto se digita. A pessoa só escolhe valores
 * da lista (como o Select), mas pode achar um entre muitos digitando. Para poucas opções, use Select.
 */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  emptyMessage = 'Nenhum resultado',
  name,
  disabled,
  readOnly,
  onBlur,
  onKeyDown,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ComboboxProps) {
  const listId = useId()
  const anchorRef = useRef<HTMLDivElement>(null)
  const [inner, setInner] = useState(defaultValue)
  const selected = value ?? inner
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? ''
  const [open, setOpen] = useState(false)
  const [text, setText] = useState(selectedLabel)
  const [filtering, setFiltering] = useState(false)
  const [active, setActive] = useState(-1)

  const filterBy = (query: string) => options.filter((o) => fold(o.label).includes(fold(query)))
  const shown = filtering ? filterBy(text) : options
  const interactive = !disabled && !readOnly

  // ao fechar, o campo volta a mostrar a opção escolhida (descarta o texto digitado)
  useEffect(() => {
    if (!open) setText(selectedLabel)
  }, [open, selectedLabel])

  useEffect(() => {
    if (open && active >= 0) {
      document.getElementById(`${listId}-${active}`)?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [open, active, listId])

  function openList() {
    if (!interactive || open) return
    setOpen(true)
    const at = options.findIndex((o) => o.value === selected)
    setActive(at >= 0 ? at : firstEnabled(options))
  }

  function close() {
    setOpen(false)
    setFiltering(false)
  }

  function choose(option: ComboboxOption) {
    if (value === undefined) setInner(option.value)
    onValueChange?.(option.value)
    close()
  }

  function change(next: string) {
    setText(next)
    setFiltering(true)
    setOpen(true)
    setActive(firstEnabled(filterBy(next)))
    if (next === '' && selected !== '') {
      if (value === undefined) setInner('')
      onValueChange?.('')
    }
  }

  return (
    <>
      <Popover.Root
        open={open && interactive}
        onOpenChange={(next) => {
          if (!next) close()
        }}
      >
        <Popover.Anchor asChild>
          <div ref={anchorRef} className="iu:w-full">
            <Input
              {...props}
              disabled={disabled}
              readOnly={readOnly}
              role="combobox"
              autoComplete="off"
              aria-label={ariaLabel}
              aria-expanded={open && interactive}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
              value={text}
              trailingIcon={<ChevronRightIcon className="iu:rotate-90" />}
              onChange={(e) => change(e.target.value)}
              onClick={(e) => {
                openList()
                onClick?.(e)
              }}
              onBlur={(e) => {
                close()
                onBlur?.(e)
              }}
              onKeyDown={(e) => {
                onKeyDown?.(e)
                if (e.defaultPrevented) return
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  if (!open) openList()
                  else setActive(move(shown, active, e.key === 'ArrowDown' ? 1 : -1))
                } else if (e.key === 'Enter' && open && shown[active]) {
                  e.preventDefault()
                  choose(shown[active])
                } else if (e.key === 'Escape' && open) {
                  e.preventDefault()
                  close()
                }
              }}
            />
          </div>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            role="presentation"
            align="start"
            sideOffset={4}
            // o foco fica no campo; a lista só é navegada por aria-activedescendant
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (e.target instanceof Node && anchorRef.current?.contains(e.target))
                e.preventDefault()
            }}
            // evita tirar o foco do campo ao clicar numa opção ou na barra de rolagem
            onMouseDown={(e) => e.preventDefault()}
            className={`${popStyles} iu:origin-[var(--radix-popover-content-transform-origin)] iu:z-50 iu:max-h-60 iu:w-[var(--radix-popover-trigger-width)] iu:overflow-y-auto iu:rounded-md iu:border iu:border-[var(--color-select-dropdown-border)] iu:bg-[var(--color-select-dropdown-bg)] iu:p-1 iu:shadow-md iu:outline-none`}
          >
            {shown.length === 0 ? (
              <div className="iu:px-3 iu:py-2 iu:text-base iu:text-[var(--color-text-secondary)]">
                {emptyMessage}
              </div>
            ) : (
              <ul
                id={listId}
                // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: padrão WAI-ARIA
                role="listbox"
                aria-label={ariaLabel ?? 'Opções'}
                className="iu:m-0 iu:list-none iu:p-0"
              >
                {shown.map((option, i) => (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado é tratado no campo (aria-activedescendant)
                  // biome-ignore lint/a11y/useFocusableInteractive: as opções nunca recebem foco; o campo aponta para elas
                  <li
                    key={option.value}
                    id={`${listId}-${i}`}
                    // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: padrão WAI-ARIA
                    role="option"
                    aria-selected={option.value === selected}
                    aria-disabled={option.disabled || undefined}
                    data-active={i === active || undefined}
                    onClick={() => !option.disabled && choose(option)}
                    onMouseMove={() => !option.disabled && setActive(i)}
                    className={cn(
                      'iu:flex iu:cursor-pointer iu:items-center iu:rounded-sm iu:px-3 iu:py-2 iu:text-base iu:text-[var(--color-select-option-text)]',
                      'iu:aria-selected:bg-[var(--color-select-option-bg-selected)] iu:data-[active]:bg-[var(--color-select-option-bg-hover)] iu:data-[active]:aria-selected:bg-[var(--color-select-option-bg-selected)]',
                      'iu:aria-disabled:cursor-not-allowed iu:aria-disabled:text-[var(--color-select-option-text-disabled)]',
                    )}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {name && <input type="hidden" name={name} value={selected} />}
    </>
  )
}
