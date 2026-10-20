import { useCSSVariable } from 'uniwind'

/**
 * Valor resolvido de um token de cor (ex.: `--color-status-success-text`) no tema atual.
 * Para o que não aceita className: cores de ícone SVG, `placeholderTextColor`, `selectionColor`,
 * `trackColor` do Switch etc. Devolve `undefined` se o token não existir.
 */
export function useToken(name: `--color-${string}`): string | undefined {
  const value = useCSSVariable(name)
  return typeof value === 'string' ? value : undefined
}
