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

  it('o Backdrop do Modal fica mais opaco no escuro (opacity/70)', () => {
    expect(light['--surface-overlay-opacity']).toMatch(/^0\.5/)
    expect(dark['--surface-overlay-opacity']).toBe('0.7')
  })
})
