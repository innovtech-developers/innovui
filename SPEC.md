# Spec: InnovUI

> Status: **aprovada em 2026-10-01** · Figma conectado via MCP · Fase 1 (Specify) do fluxo spec → plan → tasks → implement
> Repositório: `github.com/innovtech-developers/innovui`

## Premissas (corrija agora ou sigo com elas)

1. **Monorepo pnpm workspaces**, sem Turborepo/Nx no início. `pnpm -r` e `--filter` dão conta de 2 pacotes. Turborepo entra quando o tempo de build incomodar.
2. **Um pacote de lib só: `@innovui/react`.** Os design tokens (CSS variables) ficam dentro dele. Extraio `@innovui/tokens` quando surgir o segundo framework (Vue, Svelte…), não antes (YAGNI).
3. **Escopo npm `@innovui`** (precisa ser criado no npm pela org). Alternativa: `@innovtech/innovui`.
4. **React 19+** como peer dependency (`ref` como prop, sem `forwardRef`). Next.js 15+ já usa React 19.
5. **Somente ESM**, com `.d.ts`. Componentes interativos marcados com `"use client"` para funcionar no App Router (RSC) do Next.js.
6. **Tailwind CSS v4**. A lib distribui um CSS compilado (`@innovui/react/styles.css`) e quem já usa Tailwind pode importar o tema/tokens via `@import`, sem exigir Tailwind de quem consome.
7. **Tema via CSS variables** (claro/escuro, e marca customizável sobrescrevendo variáveis). Nada de ThemeProvider em JS: é mais leve e funciona em Server Components.
8. **Site em Astro**, com landing page + docs no mesmo app, saída estática (SSG), servida por Nginx em container Docker no Coolify.
9. **Código, commits, nomes de pacotes e API em inglês. Docs do site, README e CONTRIBUTING em pt-BR.**
10. **Licença MIT.**
11. **Node 24 LTS** no CI e no container.
12. **Domínio do site:** `innovui.innovtechsolutions.com.br`.

### Sobre o Astro

Sim, é o caso de uso ideal: site de conteúdo majoritariamente estático, MDX para docs, e "islands" React só onde há demo interativa. Isso resulta em JS mínimo, ótimo Lighthouse e o próprio componente da lib renderizado na doc. Sugiro **Starlight** (tema oficial de docs do Astro) para a seção `/docs`: navegação, busca (Pagefind, offline), dark mode e a11y prontos. A LP fica como página Astro custom fora do Starlight.

## Objective

Biblioteca de componentes React open source, inspirada no catálogo do [Material UI](https://mui.com/material-ui/all-components/) mas fiel ao **design system InnovUI do Figma**, mais um site com LP e documentação.

**Usuários:** primeiro os devs frontend da empresa (Brasil); depois, a comunidade open source.

**Histórias:**
- Como dev, instalo com `pnpm add @innovui/react` (ou npm/bun), importo um CSS e uso `<Button>` num projeto React/Next.js em menos de 2 minutos.
- Como dev, tenho autocomplete e tipos de todas as props, e consigo customizar com `className` sem brigar com especificidade.
- Como dev, encontro na doc o exemplo vivo, a tabela de props e as notas de acessibilidade de cada componente.
- Como contribuidor, clono, rodo `pnpm i && pnpm dev` e sei, pelo CONTRIBUTING, como abrir um PR que passa no CI.
- Como mantenedor, um merge na `main` com changeset publica no npm e o site é redeployado sem passo manual.

### Escopo de componentes

Fonte: Figma `Design-System`, página **DS — Documentation PDF** (node `907:2`), *Comhub Design System v2.1*. São 25 componentes em 6 categorias. O Figma prevalece sobre qualquer doc em PDF/Markdown.

| Fase | Categoria | Componentes do Figma |
|---|---|---|
| **0 – Fundação** | Foundations | Tokens Primitive → Semantic (light/dark) → Component (299 variáveis), tipografia Inter (16 estilos), spacing (base 4), radius, border, opacity, elevação (4 sombras), grid (12/8/4 col), ícones Lucide (16/20/24) |
| **1 – Actions e Form** | Actions | Button (5 estilos × 3 tamanhos × 6 estados), IconButton, Loading Indicator |
| | Form Controls | Input, Field (Label + controle + supporting text), Textarea, Select, Checkbox (com indeterminate), Radio, Switch |
| **2 – Feedback e Loading** | Feedback | Badge, Tag, Alert, Toast, Banner |
| | Loading & Progress | Spinner, Skeleton |
| **3 – Navegação e Overlay** | Navigation | Tab, Segmented Control, Stepper, Breadcrumb |
| | Overlay | Tooltip, Modal + Backdrop |

Cada fase é uma release minor. A **v1.0.0 sai com as fases 0–3** (todo o design system do Figma); a fase 4 entra em minors depois da v1.

| **4 – Derivados do DS** | Data display | Card, Avatar, Divider, List, Table |
| | Overlay e menus | Popover, Menu/Dropdown, Drawer |
| | Navegação | Accordion, Pagination, Link |
| | Form avançado | Autocomplete/Combobox, Slider, DatePicker, Upload |
| | Layout | Stack, Container, Grid (12/8/4 col do DS) |

**Componentes derivados (fase 4):** não existem no Figma, mas são construídos **só com os tokens e padrões do DS atual** (decisão de 2026-10-01). Exemplos: Card usa `surface/elevated`, `radius/md` e `shadow-md`, como o DS já prevê; Popover e Menu usam `shadow-md`; Drawer reaproveita o Backdrop do Modal. Regras:
- nenhum valor novo: só tokens existentes (cor, espaço, raio, sombra, tipografia);
- cada página de doc de um derivado leva o selo **"Derivado do DS · sem design no Figma"**;
- quando o design for feito no Figma, o Figma passa a prevalecer e o componente é ajustado.

**Divergências conhecidas** (Button 44/36/28 vs 56/44/36, Spinner, shadow-2xl, Tooltip max-width, Skeleton Card radius): são resolvidas lendo os valores direto das variáveis e componentes do Figma em M2.

## Tech Stack

| Área | Escolha | Status |
|---|---|---|
| Linguagem | TypeScript 5 (strict) | ✅ autorizado |
| UI | React 19 | ✅ autorizado |
| Estilo | Tailwind CSS v4 | ✅ autorizado |
| Testes | Vitest + `@vitest/coverage-v8` | ✅ autorizado |
| Site | Astro + `@astrojs/react` + `@astrojs/mdx` | ✅ autorizado |
| Docs | `@astrojs/starlight` | ✅ aprovado |
| Testes de UI | `@testing-library/react`, `@testing-library/user-event`, `jsdom` | ✅ aprovado |
| A11y em testes | `vitest-axe` | ✅ aprovado |
| Primitivos headless | Radix UI | ✅ aprovado (Radix UI) |
| Variantes | `class-variance-authority`, `clsx`, `tailwind-merge` | ✅ aprovado |
| Build da lib | `tsdown` | ✅ aprovado |
| Versionamento/release | `@changesets/cli` | ✅ aprovado |
| Lint/format | Biome | ✅ aprovado |
| Commits | `commitlint` + `lefthook` | ✅ aprovado |
| Ícones | `lucide-react` | ✅ aprovado |

## Commands

```bash
pnpm install                                # instala tudo
pnpm dev                                    # site Astro + lib em watch
pnpm build                                  # build da lib e do site
pnpm --filter @innovui/react build          # só a lib
pnpm --filter site build                    # só o site
pnpm test                                   # vitest em todos os pacotes
pnpm test:coverage                          # vitest --coverage (falha < 85%)
pnpm lint                                   # biome check .
pnpm lint:fix                               # biome check --write .
pnpm typecheck                              # tsc --noEmit em todos os pacotes
pnpm changeset                              # registra mudança para o changelog/release
docker build -f apps/site/Dockerfile -t innovui-site .   # imagem de produção do site
```

## Project Structure

```
innovui/
├─ apps/
│  └─ site/                    → Astro: LP (/) + docs (/docs, Starlight) em pt-BR
│     ├─ src/pages/            → LP e páginas custom
│     ├─ src/content/docs/     → MDX das docs (1 arquivo por componente)
│     ├─ src/components/demos/ → demos React (islands) usadas no MDX
│     ├─ Dockerfile            → multi-stage: build Node → Nginx estático
│     └─ nginx.conf
├─ packages/
│  └─ react/                   → @innovui/react
│     ├─ src/components/button/
│     │  ├─ button.tsx
│     │  ├─ button.test.tsx
│     │  └─ index.ts
│     ├─ src/styles/           → tokens (CSS variables) + tema Tailwind
│     ├─ src/utils/            → cn() e helpers compartilhados
│     └─ src/index.ts          → barrel de exports públicos
├─ .changeset/
├─ .github/
│  ├─ workflows/ci.yml         → lint, typecheck, test:coverage, build (todo PR)
│  ├─ workflows/release.yml    → changesets: abre PR de versão / publica no npm
│  ├─ workflows/deploy-site.yml→ build+push da imagem e webhook do Coolify
│  ├─ ISSUE_TEMPLATE/
│  └─ pull_request_template.md
├─ CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md  LICENSE  README.md
├─ biome.json  tsconfig.base.json  pnpm-workspace.yaml  package.json
└─ SPEC.md
```

Configs compartilhadas ficam na raiz (`tsconfig.base.json`, `biome.json`). Nada de pacotes `config-*` separados enquanto houver só 2 workspaces.

## Code Style

```tsx
// packages/react/src/components/button/button.tsx
'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover',
        secondary: 'bg-secondary text-on-secondary hover:bg-secondary-hover',
        ghost: 'bg-transparent text-fg hover:bg-surface-hover',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

**Convenções**
- Arquivos e pastas em `kebab-case`; componentes em `PascalCase`; hooks com `useX`.
- Um componente por pasta: implementação, teste e `index.ts`. Exports nomeados, sem `default`.
- Props estendem o elemento HTML nativo (`ComponentProps<'x'>`), com `className` mesclado via `cn()` (tailwind-merge) e `ref` repassado.
- Composição sobre configuração: `<Dialog.Root>/<Dialog.Content>` em vez de 20 props booleanas.
- Cores, espaços e raios só via tokens. Nenhum hex hardcoded em componente.
- Acessibilidade é requisito: teclado, foco visível, ARIA correto, contraste AA.
- Commits: Conventional Commits em inglês (`feat(button): add loading state`), validados pelo commitlint.

## Testing Strategy

- **Framework:** Vitest + Testing Library + jsdom, testes ao lado do componente (`*.test.tsx`).
- **O que testar:** comportamento observável pelo usuário (render, interação por teclado/mouse, estados controlado e não controlado, props repassadas, `className` mesclado) e um check de axe por componente. Nada de snapshot de classes CSS.
- **Cobertura:** `@vitest/coverage-v8` com threshold **85%** em lines, branches, functions e statements no `packages/react`. O CI falha abaixo disso.
- **Site:** fora do threshold (é conteúdo). O CI garante `astro check` + `astro build` sem erro.
- **Fora do escopo por enquanto:** testes visuais e E2E (Playwright, Chromatic). Entram quando houver regressão visual real.

## CI/CD

| Workflow | Gatilho | O que faz |
|---|---|---|
| `ci.yml` | PR e push na `main` | install (cache pnpm) → lint → typecheck → test:coverage → build |
| `release.yml` | push na `main` | Changesets: abre/atualiza o PR "Version Packages"; quando ele é mergeado, publica no npm com **provenance** e cria GitHub Release + CHANGELOG |
| `deploy-site.yml` | push na `main` que altere `apps/site/**` ou `packages/react/**` | Dispara o deploy no Coolify: `curl -fsS -H "Authorization: Bearer $COOLIFY_TOKEN" "$COOLIFY_WEBHOOK"` |

**Secrets no GitHub:** `COOLIFY_WEBHOOK`, `COOLIFY_TOKEN`, e `NPM_TOKEN` (ou nenhum, se usarmos *npm Trusted Publishing* via OIDC, que é o recomendado).

**Container:** `apps/site/Dockerfile` multi-stage. `node:24-alpine` + pnpm faz o build e `nginx:alpine` serve o `dist/` com gzip/brotli, cache longo para assets com hash e `HEALTHCHECK`. O Coolify builda pelo Dockerfile do repo, então o webhook só dispara o rebuild.

## Boundaries

- **Always:** rodar lint + typecheck + testes antes de commitar; criar changeset para mudança na lib; seguir tokens do Figma; manter a11y; commits semânticos em inglês; docs em pt-BR atualizadas junto com o componente.
- **Ask first:** instalar qualquer dependência fora de React/TS/Tailwind/Vitest/Astro; mudar API pública de componente já publicado (breaking change); alterar workflows de CI/CD; criar novo pacote no monorepo.
- **Never:** commitar secrets/tokens; baixar o threshold de cobertura; remover ou pular testes para o CI passar; publicar no npm manualmente fora do pipeline; inventar tokens fora do Figma; criar componente derivado sem o selo na doc ou usando valores que não são tokens.

## Success Criteria

- [ ] `pnpm add @innovui/react` funciona em um app Next.js 15+ (App Router) e em um Vite + React 19, com o componente renderizando estilizado após `import '@innovui/react/styles.css'`.
- [ ] Componentes funcionam em Server Components sem erro de hidratação (`"use client"` correto).
- [ ] Tipos exportados; autocomplete de props e variantes no editor.
- [ ] Cobertura ≥ 85% (4 métricas) no CI; 0 violações axe nos testes.
- [ ] Bundle tree-shakeable: importar só `Button` não arrasta o resto (`sideEffects` configurado só para CSS).
- [ ] Site: Lighthouse ≥ 95 em Performance, A11y, Best Practices e SEO na LP e numa página de doc.
- [ ] Toda página de componente tem demo viva, tabela de props, exemplos e notas de acessibilidade, em pt-BR.
- [ ] Merge na `main` com changeset publica nova versão no npm sem passo manual.
- [ ] Merge na `main` redeploya o site no Coolify via webhook.
- [ ] README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE, templates de issue/PR presentes.

## Decisões tomadas

- 2026-10-01: stack recomendada aprovada (Radix UI, Biome, tsdown, Changesets, commitlint + lefthook, Testing Library, vitest-axe, Starlight, cva/clsx/tailwind-merge).
- 2026-10-01: ícones via `lucide-react`.
- 2026-10-01: React 19+ (sem suporte a React 18).
- 2026-10-01: pacote `@innovui/react`; prefixo Tailwind `iu:`; roxo do DS (`purple/600` `#9035EE`) é a cor primária padrão.
- 2026-10-01: escopo amplo (estilo MUI) mantido: componentes fora do Figma são derivados dos tokens do DS (fase 4).
- 2026-10-01: tabela de props escrita à mão no MDX; automatizar quando passar de ~10 componentes.
- 2026-10-01: domínio `innovui.innovtechsolutions.com.br`; Coolify builda pelo Dockerfile do repo.

## Open Questions

1. ~~Acesso ao Figma~~: resolvido em 2026-10-01 (Figma MCP).
2. **Escopo npm `@innovui`:** ainda não existe (`@innovui/react` está livre no registry). Precisa ser criado em npmjs.com → *Add Organization* → `innovui` → plano Free (pacotes públicos), **antes do primeiro publish (T4.2)**. Não bloqueia M0–M3.
