import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// prefixo `iu:` casa com o prefix(iu) do Tailwind da lib (ver src/styles/index.css),
// para o tailwind-merge continuar resolvendo conflito entre classes utilitárias iu:*
const twMerge = extendTailwindMerge({ prefix: 'iu' })

/** Mescla classes condicionais e resolve conflitos de utilitários Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
