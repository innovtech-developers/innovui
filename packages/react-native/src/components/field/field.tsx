/// <reference types="uniwind/types" />

import { cloneElement, type ReactElement, type ReactNode } from 'react'
import { Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { StatusIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

export type FieldProps = {
  /** Texto do rótulo. */
  label: string
  /** Exibe um asterisco vermelho após o rótulo. */
  required?: boolean
  /** Propaga vermelho para rótulo, borda do controle e texto de apoio. */
  error?: boolean
  disabled?: boolean
  /** Propaga somente leitura ao controle. */
  readOnly?: boolean
  /** Tamanho do rótulo e do controle (o `sm` usa rótulo de 12px). */
  size?: 'sm' | 'md' | 'lg'
  /** Instrução (estado normal) ou mensagem de erro (estado error). */
  supportingText?: ReactNode
  /** O controle: Input, Textarea ou Select. Recebe disabled/error/size e o nome acessível. */
  children: ReactElement<{
    disabled?: boolean
    readOnly?: boolean
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    accessibilityLabel?: string
    accessibilityHint?: string
  }>
  className?: string
}

/** Combina rótulo + controle + texto de apoio — o jeito certo de montar um campo de formulário. */
export function Field({
  label,
  required,
  error,
  disabled,
  readOnly,
  size,
  supportingText,
  children,
  className,
}: FieldProps) {
  const errorColor = useToken('--color-status-error-text')

  return (
    <View className={cn('gap-1', className)}>
      <Text
        className={cn(
          'font-medium text-field-text-label',
          size === 'sm' ? 'text-xs leading-4' : 'text-sm',
          error && 'text-status-error-text',
        )}
      >
        {label}
        {required ? (
          // Sem `htmlFor` no native: o nome acessível vai por accessibilityLabel no controle,
          // então o asterisco fica escondido do leitor de tela.
          <Text
            className="text-status-error-text"
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {' *'}
          </Text>
        ) : null}
      </Text>
      {cloneElement(children, {
        disabled: disabled ?? children.props.disabled,
        readOnly: readOnly ?? children.props.readOnly,
        size: size ?? children.props.size,
        error: error ?? children.props.error,
        accessibilityLabel: children.props.accessibilityLabel ?? label,
        accessibilityHint:
          children.props.accessibilityHint ??
          (typeof supportingText === 'string' ? supportingText : undefined),
      })}
      {supportingText ? (
        <View
          className="flex-row items-center gap-1"
          // Mensagem de erro é anunciada assim que aparece.
          accessibilityLiveRegion={error ? 'polite' : undefined}
        >
          {error ? (
            <StatusIcon status="error" color={errorColor} style={{ width: 16, height: 16 }} />
          ) : null}
          {typeof supportingText === 'string' ? (
            <Text
              className={cn(
                'shrink text-xs leading-4 text-field-text-label',
                error && 'text-status-error-text',
              )}
            >
              {supportingText}
            </Text>
          ) : (
            supportingText
          )}
        </View>
      ) : null}
    </View>
  )
}
