/// <reference types="uniwind/types" />

import { View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

export type DividerProps = Omit<ViewProps, 'children'> & {
  className?: string
  /** `vertical` precisa de um pai em linha (ou altura definida) para ocupar a altura. */
  orientation?: 'horizontal' | 'vertical'
}

/** Linha fina que separa blocos de conteúdo. Usa `border/default`. */
export function Divider({ className, orientation = 'horizontal', ...props }: DividerProps) {
  return (
    // decorativo: o RN não tem role "separator", então some da árvore de acessibilidade
    <View
      importantForAccessibility="no"
      className={cn(
        'shrink-0 bg-border-default',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className,
      )}
      {...props}
    />
  )
}
