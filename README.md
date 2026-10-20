# InnovUI

Biblioteca de componentes React, com tipagem completa em TypeScript e estilo em Tailwind CSS, construída a partir do design system da Comhub. Inclui landing page e documentação em [`apps/site`](apps/site).

> 🚧 Em desenvolvimento. Ainda sem release publicada no npm.

## Instalação

```bash
pnpm add @innovui/react
# ou: npm install @innovui/react / bun add @innovui/react
```

```tsx
import { Button } from '@innovui/react'
import '@innovui/react/styles.css'

function App() {
  return <Button>Salvar alterações</Button>
}
```

Funciona em qualquer projeto React 19+, incluindo Server Components do Next.js (App Router). Não exige Tailwind instalado no projeto que consome a lib.

## Monorepo

```
apps/site       → landing page + documentação (Astro + Starlight) (pnpm site)
apps/expo       → app Expo para testar @innovui/react-native (pnpm expo)
packages/react         → @innovui/react
packages/react-native  → @innovui/react-native (Uniwind)
```

## Comandos

```bash
pnpm install          # instala tudo
pnpm dev              # site + lib em watch
pnpm build            # build de tudo
pnpm test:coverage    # testes com cobertura (mínimo 85% em packages/react)
pnpm lint             # biome check
```

## Documentação

A documentação completa de cada componente (exemplos, props, acessibilidade) fica no site, em `apps/site/src/content/docs`.

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

[MIT](LICENSE)
