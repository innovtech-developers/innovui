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
3. Rode `pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm build` antes de abrir o PR. O CI roda os mesmos checks, só que pelo [Turborepo](https://turborepo.dev) e só nos pacotes que o PR afeta (os que mudaram e os que dependem deles). Para simular: `pnpm turbo run typecheck test:coverage build --affected`.
4. Se a mudança afeta `packages/react` ou `packages/react-native`, adicione um changeset: `pnpm changeset`.
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

1. Construa o componente reaproveitando os tokens já existentes (cor, espaço, raio, sombra, tipografia), nunca com valores novos.
2. Crie a pasta `packages/react/src/components/<nome>/` com `<nome>.tsx`, `<nome>.test.tsx` e `index.ts`.
3. Props estendem o elemento HTML nativo (`ComponentProps<'button'>`, etc.), aceitam `className` (mesclado com `cn()`) e repassam `ref`.
4. Exporte o componente no barrel `packages/react/src/index.ts`.
5. Escreva testes (Vitest + Testing Library) cobrindo render, interação e acessibilidade (`jest-axe`). O projeto exige 85% de cobertura mínima.
6. Crie a página de doc em `apps/site/src/content/docs/components/<nome>.mdx`: demo viva, tabela de props, exemplos de uso e notas de acessibilidade — em pt-BR.
7. Rode `pnpm changeset` e descreva a mudança (tipo `minor` para componente novo, `patch` para correção).

## Padrões de código

- TypeScript estrito, sem `any` não justificado.
- Composição sobre configuração (ex.: `<Dialog.Root>/<Dialog.Content>`, não uma dúzia de props booleanas).
- Acessibilidade não é opcional: navegação por teclado, foco visível, ARIA correto, contraste mínimo AA.
- `pnpm lint:fix` aplica a formatação (Biome) automaticamente.

## Setup único do repositório (mantenedores)

Passos manuais de configuração, fora do alcance do código, feitos uma vez por quem administra a org/repositório:

1. **Permitir PR por Actions** — `github.com/organizations/innovtech-developers/settings/actions` → *Workflow permissions* → marcar "Allow GitHub Actions to create and approve pull requests". Sem isso, o `release.yml` falha ao tentar abrir o PR "Version Packages" (o bloqueio é uma política de org, não do repositório).
2. **Criar a org `@innovui` no npm** — [npmjs.com](https://www.npmjs.com) → *Add Organization* → `innovui` (plano gratuito, pacotes públicos). Sem isso, não há onde publicar `@innovui/react`.
3. **Trusted Publisher no npm (por pacote)** — em `npmjs.com/package/@innovui/react/access` (e `…/@innovui/react-native/access`) → *Trusted Publisher* → GitHub Actions: organização `innovtech-developers`, repositório `innovui`, workflow `release.yml`. Sem token: o `release.yml` publica via OIDC (`id-token: write`) e gera a provenance automaticamente. O Trusted Publisher só pode ser configurado em um pacote que já existe no npm, então o **primeiro publish de cada pacote novo é manual**: `pnpm --filter <pacote> build`, depois, dentro do pacote, `npm publish --access public` (com o seu login do npm e o 2FA). Faça isso e configure o Trusted Publisher **antes** de mergear o PR "Version Packages" que inclui o pacote novo.
4. **Secrets `COOLIFY_WEBHOOK` e `COOLIFY_TOKEN`** — no Coolify, criar a aplicação do site apontando para este repositório (`apps/site/Dockerfile`), copiar a *deploy webhook URL* e gerar um token de API; adicionar os dois como secrets do repositório.

### O que sobe a cada mudança

- **Pacotes npm:** só sobe o pacote que tem changeset pendente (o Changesets compara a versão com o registro). Mexer no `@innovui/react-native` não publica o `@innovui/react`, e vice-versa; mudanças só no site não publicam nada.
- **Site:** o `deploy-site.yml` só chama o Coolify se o commit afetou o site (`turbo ls --affected --filter=site`): mudou o próprio `apps/site` ou o `@innovui/react`, de que ele depende. Uma mudança só no `@innovui/react-native` não redeploya. Para forçar um deploy, rode o workflow à mão (*Run workflow*).

Até esses passos serem feitos, `pnpm lint/typecheck/test/build` (CI) continuam funcionando normalmente — só o publish no npm e o deploy no Coolify ficam pendentes.

## Dúvidas

Abra uma [issue](https://github.com/innovtech-developers/innovui/issues) ou comece uma discussão no PR.
