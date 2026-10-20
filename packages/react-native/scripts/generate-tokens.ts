/**
 * Gera src/tokens/generated.ts a partir de packages/react/src/styles/tokens.css,
 * para web e native partilharem a mesma fonte de verdade (o Figma, via tokens.css).
 *
 * Uso: pnpm generate:tokens  (e `--check` no CI/teste para falhar se o arquivo estiver defasado)
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(here, '../../react/src/styles/tokens.css')
const outPath = resolve(here, '../src/tokens/generated.ts')
const themePath = resolve(here, '../theme.css')

const css = readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** Conteúdo do primeiro bloco `{ ... }` cujo seletor começa em `selector`. */
function block(selector: string): string {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`Bloco não encontrado: ${selector}`)
  const open = css.indexOf('{', start)
  const close = css.indexOf('\n}', open)
  return css.slice(open + 1, close)
}

function declarations(body: string): Map<string, string> {
  const map = new Map<string, string>()
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    map.set(name as string, (value as string).trim())
  }
  return map
}

const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())

const theme = declarations(block('@theme'))
const light = declarations(block(':root'))
const dark = declarations(block('[data-theme="dark"]'))

const isRamp = (name: string) => /^color-[a-z]+-\d+$/.test(name)

const palette: Record<string, string> = {}
for (const [name, value] of theme) {
  if (isRamp(name)) palette[camel(name.replace('color-', ''))] = value
}

function colors(map: Map<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [name, value] of map) {
    if (name.startsWith('color-')) out[camel(name.replace('color-', ''))] = value
  }
  return out
}

const lightColors = colors(light)
const darkColors = colors(dark)

const missing = Object.keys(lightColors).filter((k) => !(k in darkColors))
if (missing.length) throw new Error(`Tokens sem valor no modo escuro: ${missing.join(', ')}`)

const px = (v: string) => Number.parseFloat(v)

const radius: Record<string, number> = {}
for (const [name, value] of theme) {
  if (name.startsWith('radius-')) radius[camel(name.replace('radius-', ''))] = px(value)
}

const typography: Record<string, Record<string, number>> = {}
for (const [name, value] of theme) {
  const m = name.match(/^text-([a-z]+-[a-z0-9]+)(?:--(.+))?$/)
  if (!m) continue
  const key = camel(m[1] as string)
  const prop = camel(
    (
      {
        'line-height': 'lineHeight',
        'letter-spacing': 'letterSpacing',
        'font-weight': 'fontWeight',
      } as Record<string, string>
    )[m[2] ?? ''] ?? 'fontSize',
  )
  typography[key] ??= {}
  ;(typography[key] as Record<string, number>)[prop] = px(value)
}

const overlay = {
  light: px(light.get('surface-overlay-opacity') ?? '0.5'),
  dark: px(dark.get('surface-overlay-opacity') ?? '0.7'),
}

const lit = (v: unknown) => JSON.stringify(v, null, 2)

const output = `// Arquivo gerado por scripts/generate-tokens.ts a partir de packages/react/src/styles/tokens.css.
// Não edite à mão: rode \`pnpm --filter @innovui/react-native generate:tokens\`.

export const palette = ${lit(palette)} as const

export const lightColors = ${lit(lightColors)} as const

export const darkColors = ${lit(darkColors)} as const

export const radius = ${lit(radius)} as const

/** Estilos de texto em px. \`fontWeight\` é numérico; converta para string no StyleSheet. */
export const typography = ${lit(typography)} as const

export const overlayOpacity = ${lit(overlay)} as const
`

const kebab = (s: string) => s.replace(/[A-Z0-9]/g, (c) => `-${c.toLowerCase()}`)
const vars = (colors: Record<string, string>) =>
  Object.entries(colors)
    .map(([k, v]) => `      --color-${kebab(k)}: ${v};`)
    .join('\n')

// Formato do Uniwind: variáveis por tema em `@layer theme` + `@variant`. Cada token vira utilitário
// (`--color-button-primary-bg` → `bg-button-primary-bg`). As rampas da paleta ficam de fora para não
// sobrescrever a paleta do Tailwind do app consumidor.
const themeCss = `/* Gerado por scripts/generate-tokens.ts a partir de packages/react/src/styles/tokens.css. Não edite à mão. */

@layer theme {
  :root {
    @variant light {
${vars(lightColors)}
    }

    @variant dark {
${vars(darkColors)}
    }
  }
}
`

const files: [string, string][] = [
  [outPath, output],
  [themePath, themeCss],
]

if (process.argv.includes('--check')) {
  const stale = files.filter(([path, content]) => {
    try {
      return readFileSync(path, 'utf8') !== content
    } catch {
      return true
    }
  })
  if (stale.length) {
    console.error('Arquivos de tokens defasados. Rode `pnpm generate:tokens`.')
    process.exit(1)
  }
} else {
  for (const [path, content] of files) writeFileSync(path, content)
  console.log('Tokens gerados.')
}
