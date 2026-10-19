import { Children, type ComponentProps, createContext, useContext } from 'react'
import { cn } from '../../utils/cn'
import { CheckIcon } from '../_shared/status'

type StepState = 'completed' | 'active' | 'upcoming'

const StepContext = createContext<{ state: StepState; number: number }>({
  state: 'upcoming',
  number: 1,
})

export type StepperProps = ComponentProps<'ol'> & {
  /** Índice (a partir de 0) do passo atual: os anteriores ficam concluídos, os seguintes pendentes. */
  current: number
}

/** Progresso de um fluxo de 2–7 etapas (checkout, onboarding). O estado de cada `Step` vem de `current`. */
export function Stepper({ className, current, children, ...props }: StepperProps) {
  return (
    <ol className={cn('iu:flex iu:flex-wrap iu:items-center iu:gap-8', className)} {...props}>
      {Children.toArray(children).map((child, index) => (
        <StepContext.Provider
          // biome-ignore lint/suspicious/noArrayIndexKey: a posição do passo é a identidade dele
          key={index}
          value={{
            number: index + 1,
            state: index < current ? 'completed' : index === current ? 'active' : 'upcoming',
          }}
        >
          {child}
        </StepContext.Provider>
      ))}
    </ol>
  )
}

const indicator: Record<StepState, string> = {
  completed: 'iu:bg-[var(--color-bg-success-emphasis)]',
  active: 'iu:bg-[var(--color-interactive-primary)]',
  upcoming: 'iu:bg-[var(--color-interactive-disabled)]',
}

export type StepProps = ComponentProps<'li'>

/** Um passo do `Stepper`: o rótulo vai como `children`; o número vem da posição. */
export function Step({ className, children, ...props }: StepProps) {
  const { state, number } = useContext(StepContext)

  return (
    <li
      aria-current={state === 'active' ? 'step' : undefined}
      className={cn('iu:flex iu:items-center iu:gap-2', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'iu:flex iu:size-7 iu:shrink-0 iu:items-center iu:justify-center iu:rounded-full iu:text-[13px] iu:leading-4 iu:font-bold iu:text-[var(--color-text-inverse)]',
          indicator[state],
        )}
      >
        {state === 'completed' ? <CheckIcon /> : number}
      </span>
      <span
        className={cn(
          'iu:text-sm iu:leading-5 iu:font-medium iu:whitespace-nowrap',
          state === 'upcoming'
            ? 'iu:text-[var(--color-text-tertiary)]'
            : 'iu:text-[var(--color-text-primary)]',
        )}
      >
        {children}
      </span>
      {state === 'completed' && <span className="iu:sr-only">(concluído)</span>}
    </li>
  )
}
