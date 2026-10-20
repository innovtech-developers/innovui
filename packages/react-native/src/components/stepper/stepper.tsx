/// <reference types="uniwind/types" />

import { Children, createContext, type ReactNode, useContext } from 'react'
import { Text, View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'
import { CheckIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

type StepState = 'completed' | 'active' | 'upcoming'

const StepContext = createContext<{ state: StepState; number: number }>({
  state: 'upcoming',
  number: 1,
})

export type StepperProps = ViewProps & {
  className?: string
  /** Índice (a partir de 0) do passo atual: os anteriores ficam concluídos, os seguintes pendentes. */
  current: number
}

/** Progresso de um fluxo de 2–7 etapas (checkout, onboarding). O estado de cada `Step` vem de `current`. */
export function Stepper({ className, current, children, ...props }: StepperProps) {
  return (
    <View className={cn('flex-row flex-wrap items-center gap-8', className)} {...props}>
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
    </View>
  )
}

const indicator: Record<StepState, string> = {
  completed: 'bg-bg-success-emphasis',
  active: 'bg-interactive-primary',
  upcoming: 'bg-interactive-disabled',
}

export type StepProps = ViewProps & {
  className?: string
  /** Complemento lido em passos concluídos (o web usa texto só para leitor de tela). */
  completedLabel?: string
  children?: ReactNode
}

/** Um passo do `Stepper`: o rótulo vai como `children`; o número vem da posição. */
export function Step({
  className,
  completedLabel = 'concluído',
  children,
  accessibilityLabel,
  accessibilityState,
  ...props
}: StepProps) {
  const { state, number } = useContext(StepContext)
  const checkColor = useToken('--color-text-inverse')
  // Um único elemento acessível por passo; o label só é montado quando o rótulo é texto.
  const label =
    accessibilityLabel ??
    (typeof children === 'string' && state === 'completed'
      ? `${children} (${completedLabel})`
      : undefined)

  return (
    <View
      accessible
      accessibilityLabel={label}
      // RN não tem aria-current: o passo atual vai como `selected`.
      accessibilityState={{ ...accessibilityState, selected: state === 'active' }}
      className={cn('flex-row items-center gap-2', className)}
      {...props}
    >
      <View
        importantForAccessibility="no-hide-descendants"
        className={cn('size-7 shrink-0 items-center justify-center rounded-full', indicator[state])}
      >
        {state === 'completed' ? (
          <CheckIcon color={checkColor} />
        ) : (
          <Text className="text-[13px] font-bold text-text-inverse">{number}</Text>
        )}
      </View>
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'text-sm font-medium',
            state === 'upcoming' ? 'text-text-tertiary' : 'text-text-primary',
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}
