# Contribuindo com o InnovUI

Obrigado por contribuir! Este guia cobre o setup local, o fluxo de PR e como adicionar um componente novo.

## Setup

Pré-requisitos: Node 24 e pnpm 11 (`corepack enable` ou `npm i -g pnpm@11`).

```bash
git clone https://github.com/innovtech-developers/innovui.git
cd innovui
pnpm install
pnpm dev
```

`pnpm install` já configura os git hooks (lefthook) na primeira vez.

## Fluxo de contribuição

1. Abra uma issue descrevendo o que pretende mudar (bug, componente novo, melhoria), a não ser que já exista uma.
2. Crie um branch a partir da `main`: `feat/nome-curto`, `fix/nome-curto`.
3. Rode `pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm build` antes de abrir o PR. O CI roda os mesmos checks.
4. Se a mudança afeta `packages/react`, adicione um changeset: `pnpm changeset`.
5. Abra o PR preenchendo o template. PRs de componente novo precisam de página de doc em `apps/site/src/content/docs`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), em inglês, validados pelo commitlint:

```
feat(button): add loading state
fix(input): forward ref correctly
docs(select): add keyboard navigation notes
chore: bump dependency versions
```

Tipos aceitos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

## Como criar um componente novo

1. Confira se o componente existe no [Figma do design system](https://www.figma.com/design/Qi9eahiHd9Zn6b0ZbffmKB). Se não existir, ele só pode ser construído reaproveitando os tokens já existentes (cor, espaço, raio, sombra, tipografia) — nunca com valores novos — e a página de doc leva o selo "Derivado do DS".
2. Crie a pasta `packages/react/src/components/<nome>/` com `<nome>.tsx`, `<nome>.test.tsx` e `index.ts`.
3. Props estendem o elemento HTML nativo (`ComponentProps<'button'>`, etc.), aceitam `className` (mesclado com `cn()`) e repassam `ref`.
4. Exporte o componente no barrel `packages/react/src/index.ts`.
5. Escreva testes (Vitest + Testing Library) cobrindo render, interação e acessibilidade (`vitest-axe`). O projeto exige 85% de cobertura mínima.
6. Crie a página de doc em `apps/site/src/content/docs/components/<nome>.mdx`: demo viva, tabela de props, exemplos de uso e notas de acessibilidade — em pt-BR.
7. Rode `pnpm changeset` e descreva a mudança (tipo `minor` para componente novo, `patch` para correção).

## Padrões de código

- TypeScript estrito, sem `any` não justificado.
- Composição sobre configuração (ex.: `<Dialog.Root>/<Dialog.Content>`, não uma dúzia de props booleanas).
- Acessibilidade não é opcional: navegação por teclado, foco visível, ARIA correto, contraste mínimo AA.
- `pnpm lint:fix` aplica a formatação (Biome) automaticamente.

## Dúvidas

Abra uma [issue](https://github.com/innovtech-developers/innovui/issues) ou comece uma discussão no PR.
