// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = new URL('.', import.meta.url).pathname

const sources = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((dir) =>
    readdirSync(join(root, dir.name))
      .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
      .map((file) => ({
        path: `${dir.name}/${file}`,
        code: readFileSync(join(root, dir.name, file), 'utf8'),
      })),
  )

// Hooks, contexto e bibliotecas de UI com estado só funcionam em Client Components: sem a
// diretiva, importar o componente num Server Component (Next.js) quebra o build do consumidor.
const NEEDS_CLIENT =
  /\b(createContext|useContext|useState|useEffect|useLayoutEffect|useRef|useCallback|useMemo|useId|useReducer)\b|@radix-ui\/react-(?!slot)/

describe("diretiva 'use client'", () => {
  it('encontra os arquivos de componente', () => {
    expect(sources.length).toBeGreaterThan(20)
  })

  it.each(sources.filter(({ code }) => NEEDS_CLIENT.test(code)))(
    '$path usa hooks/contexto/Radix e começa com "use client"',
    ({ code }) => {
      expect(code.trimStart().startsWith("'use client'")).toBe(true)
    },
  )
})
