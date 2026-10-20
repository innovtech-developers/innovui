# InnovUI

[![npm @innovui/react](https://img.shields.io/npm/v/@innovui/react?label=%40innovui%2Freact)](https://www.npmjs.com/package/@innovui/react)
[![npm @innovui/react-native](https://img.shields.io/npm/v/@innovui/react-native?label=%40innovui%2Freact-native)](https://www.npmjs.com/package/@innovui/react-native)
[![CI](https://github.com/innovtech-developers/innovui/actions/workflows/ci.yml/badge.svg)](https://github.com/innovtech-developers/innovui/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)

O design system da Comhub como bibliotecas de componentes: **`@innovui/react`** para a web e **`@innovui/react-native`** para apps mobile, com os mesmos componentes, tipagem completa em TypeScript, modo claro e escuro e acessibilidade por padrão.

📚 **Documentação, exemplos e props de cada componente:** [innovui.innovtechsolutions.com.br](https://innovui.innovtechsolutions.com.br)

## Pacotes

| Pacote | Para | Estilo |
|---|---|---|
| [`@innovui/react`](packages/react) | Web: React 19+, incluindo Server Components do Next.js | Tailwind CSS v4, já compilado (não exige Tailwind no seu projeto) |
| [`@innovui/react-native`](packages/react-native) | Apps React Native 0.81+ (Expo ou puro) | [Uniwind](https://docs.uniwind.dev) (Tailwind v4 para React Native) |

## Instalação

**Web:**

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

**Mobile:**

```bash
pnpm add @innovui/react-native uniwind tailwindcss react-native-svg
```

O `@innovui/react-native` precisa de um passo a passo de configuração (Metro e `global.css`): veja o [guia de instalação](https://innovui.innovtechsolutions.com.br/react-native/instalacao/).

## Monorepo

```
packages/react         → @innovui/react
packages/react-native  → @innovui/react-native
apps/site              → landing page e documentação (Astro + Starlight)
apps/expo              → app Expo para testar o @innovui/react-native
```

Gerenciado com pnpm e [Turborepo](https://turborepo.dev): o CI roda só nos pacotes que uma mudança afeta, e o deploy do site só acontece quando ele é afetado. Os pacotes são versionados com [Changesets](https://github.com/changesets/changesets) e publicados no npm pelo GitHub Actions.

## Comandos

```bash
pnpm install          # instala tudo
pnpm dev              # site + lib em watch
pnpm build            # build de tudo (Turborepo, com cache)
pnpm test:coverage    # testes com cobertura (mínimo 85% em packages/react)
pnpm typecheck        # tipos de todos os pacotes
pnpm lint             # biome check
pnpm expo             # app Expo (mobile)
```

Pré-requisitos: Node 24 e pnpm 11.

## Versionamento

[Semver](https://semver.org/lang/pt-BR/). O `@innovui/react` está na versão estável 1.x. O `@innovui/react-native` ainda é 0.x e pode mudar entre minors. As notas de cada versão ficam nos `CHANGELOG.md` de cada pacote e nas [releases do GitHub](https://github.com/innovtech-developers/innovui/releases).

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md). Para reportar uma vulnerabilidade, veja [SECURITY.md](SECURITY.md).

## Licença

[MIT](LICENSE)
