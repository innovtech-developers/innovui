// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')

const declarations = (block: string) =>
  Object.fromEntries([...block.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]]))

const darkStart = css.indexOf('\n.dark,')
const light = declarations(css.slice(css.indexOf('\n:root {'), darkStart))
const dark = declarations(css.slice(darkStart))

// Tokens que valem igual nos dois modos (mesmo valor no Light e no Dark do Figma).
const SAME_IN_BOTH_MODES = [
  '--color-border-focus',
  '--color-surface-overlay', // só a opacidade muda (--surface-overlay-opacity)
  '--color-button-focus-ring',
  '--color-field-focus-ring',
  '--color-selection-focus-ring',
]

describe('tokens: modo escuro', () => {
  it('o bloco escuro só sobrescreve tokens que existem no :root', () => {
    const orphans = Object.keys(dark).filter((name) => name !== 'color-scheme' && !(name in light))
    expect(orphans).toEqual([])
  })

  it('todo token de cor semântico/de componente tem valor no modo escuro', () => {
    const missing = Object.keys(light).filter(
      (name) =>
        name.startsWith('--color-') && !(name in dark) && !SAME_IN_BOTH_MODES.includes(name),
    )
    expect(missing).toEqual([])
  })

  it('os tokens listados como iguais nos dois modos têm o mesmo valor', () => {
    for (const name of SAME_IN_BOTH_MODES) {
      expect(light[name]).toBeDefined()
      if (name in dark) expect(dark[name]).toBe(light[name])
    }
  })

  it('ativa por classe ou atributo, sem prefers-color-scheme automático', () => {
    expect(css).toContain('.dark,\n[data-theme="dark"] {')
    expect(css).not.toContain('prefers-color-scheme: dark')
  })

  it('as bordas aparecem contra a superfície no escuro (border/default ≠ surface/elevated)', () => {
    expect(dark['--color-border-default']).toBe('#66748c') // gray/500
    expect(dark['--color-border-strong']).toBe('#96a3b9') // gray/400, um passo acima do default
    expect(dark['--color-border-default']).not.toBe(dark['--color-surface-elevated'])
    expect(dark['--color-border-default']).not.toBe(dark['--color-bg-tertiary'])
  })

  it('os tokens de componente que seguem as bordas acompanham os novos valores', () => {
    for (const name of [
      '--color-field-border',
      '--color-field-border-disabled',
      '--color-selection-border-disabled',
      '--color-status-neutral-border',
    ]) {
      expect(dark[name], name).toBe(dark['--color-border-default'])
    }
    for (const name of ['--color-field-border-hover', '--color-selection-toggle-track-off-hover']) {
      expect(dark[name], name).toBe(dark['--color-border-strong'])
    }
  })

  it('o Backdrop do Modal fica mais opaco no escuro (opacity/70)', () => {
    expect(light['--surface-overlay-opacity']).toMatch(/^0\.5/)
    expect(dark['--surface-overlay-opacity']).toBe('0.7')
  })
})

// Contraste (WCAG 2.x): luminância relativa e razão entre duas cores hex.
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0)
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05)
}
const colors = {
  light,
  dark: { ...light, ...dark },
} as const

// Pares de texto sobre fundo que o design system promete em 4.5:1 ou mais, nos dois modos.
// Fora da lista, de propósito: text/tertiary, text/disabled e o placeholder (exceções documentadas).
const TEXT_PAIRS: [string, string][] = [
  ['text-primary', 'bg-primary'],
  ['text-primary', 'bg-secondary'],
  ['text-primary', 'bg-tertiary'],
  ['text-primary', 'surface-elevated'],
  ['text-secondary', 'bg-primary'],
  ['text-secondary', 'bg-secondary'],
  ['text-secondary', 'bg-tertiary'],
  ['text-secondary', 'surface-elevated'],
  ['text-brand', 'bg-primary'],
  ['text-brand', 'bg-secondary'],
  ['text-brand', 'surface-elevated'],
  ['status-success-text', 'status-success-bg'],
  ['status-error-text', 'status-error-bg'],
  ['status-warning-text', 'status-warning-bg'],
  ['status-info-text', 'status-info-bg'],
  ['status-neutral-text', 'status-neutral-bg'],
  ['status-pending-text', 'status-pending-bg'],
  ['status-success-text', 'bg-primary'],
  ['status-error-text', 'bg-primary'],
  ['status-info-text', 'bg-primary'],
  ['status-warning-text', 'bg-primary'],
  ['button-primary-text', 'button-primary-bg'],
  ['button-primary-text', 'button-primary-bg-hover'],
  ['button-primary-text', 'button-primary-bg-active'],
  ['button-secondary-text', 'button-secondary-bg'],
  ['button-secondary-text', 'button-secondary-bg-hover'],
  ['button-ghost-text', 'bg-primary'],
  ['button-ghost-text', 'button-ghost-bg-hover'],
  ['button-tertiary-text', 'bg-primary'],
  ['button-destructive-text', 'button-destructive-bg'],
  ['button-destructive-text', 'button-destructive-bg-hover'],
  ['button-destructive-text', 'button-destructive-bg-active'],
  ['field-text', 'field-bg'],
  ['field-text-label', 'field-bg'],
  ['select-option-text', 'select-dropdown-bg'],
  ['select-option-text', 'select-option-bg-hover'],
  ['select-option-text', 'select-option-bg-selected'],
  ['selection-text-label', 'bg-primary'],
  ['selection-indicator-selected', 'selection-bg-selected'],
  ['text-inverse', 'bg-inverse'],
  ['text-inverse-secondary', 'bg-inverse'],
  ['text-inverse', 'interactive-primary'],
]

describe('tokens: contraste', () => {
  it.each(['light', 'dark'] as const)('no modo %s, todo par de texto passa em 4.5:1', (mode) => {
    const failures = TEXT_PAIRS.map(([fg, bg]) => {
      const ratio = contrast(
        colors[mode][`--color-${fg}`] ?? '',
        colors[mode][`--color-${bg}`] ?? '',
      )
      return { pair: `${fg} / ${bg}`, ratio: Math.round(ratio * 100) / 100 }
    }).filter(({ ratio }) => ratio < 4.5)
    expect(failures).toEqual([])
  })

  it('o ✓ branco do Stepper (gráfico) passa em 3:1 sobre bg/success-emphasis, nos dois modos', () => {
    for (const mode of ['light', 'dark'] as const) {
      const ratio = contrast(
        colors[mode]['--color-text-inverse'] ?? '',
        colors[mode]['--color-bg-success-emphasis'] ?? '',
      )
      expect(ratio).toBeGreaterThanOrEqual(3)
    }
  })
})
