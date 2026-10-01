# Plano de implementação: InnovUI

> Status: **aprovado em 2026-10-01** · Fases 2 (Plan) e 3 (Tasks) · Base: [SPEC.md](SPEC.md)

## Visão geral

```
M0 Fundação do repo ──┬──→ M1 Esqueleto da lib ──→ M2 Tokens (Figma) ──→ M5+ Componentes por fase
                      ├──→ M3 Esqueleto do site ─────────────────────────↗ (docs de cada componente)
                      └──→ M4 CI/CD (depende de M1 + M3 para ter o que rodar)
```

- **M0–M1, M3 e M4 não dependem do Figma.** Dá para entregar toda a infraestrutura (monorepo, build, testes, site, Docker, pipelines) em paralelo com a extração dos tokens.
- **M2 lê o Figma via MCP (já conectado).** Sem os tokens reais, nenhum componente é estilizado, para não inventar valores (regra *Never* da spec).
- Depois de M4, M1/M3 e o pipeline ficam provados de ponta a ponta com um componente-piloto (Button). Cada componente seguinte é uma task repetível.

## Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Conflito de classes Tailwind da lib com o Tailwind do app consumidor | Estilos quebrados no app do usuário | Prefixo Tailwind v4 `iu:` em tudo que o Tailwind gera (classes e @theme); tokens semantic/component ficam fora do @theme, em `:root` puro, para não herdar o prefixo e quebrar as referências var() nos componentes; `tailwind-merge` com o mesmo prefixo |
| npm Trusted Publishing exige que o pacote já exista | 1º publish automático falha | 1º publish (`0.0.1`) com `NPM_TOKEN`; depois migra para OIDC e remove o token |
| `"use client"` perdido no bundle (o tsdown pode remover diretivas) | Erro em Server Components no Next.js | Build preserva a diretiva por arquivo (`unbundle`/preserveModules) + teste de smoke que verifica o `dist/` |
| Starlight + LP custom no mesmo app ficarem com cara de dois sites | UX inconsistente | LP usa os mesmos tokens e componentes da lib; tema do Starlight sobrescrito pelos tokens InnovUI |
| Escopo "lib completa" grande demais | Nunca chega à v1 | Releases minor por fase (spec); v1.0.0 = fases 1–3 |

## Checkpoints de verificação

- **CP1 (após M0+M1): ✅ feito 2026-10-01.** `pnpm i && pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm build` verde; `dist/` com ESM + `.d.ts` + `styles.css` (13 arquivos, 12.91 kB).
- **CP2 (após M3): ✅ feito 2026-10-01.** `pnpm --filter site build` gera site estático (7 páginas); `docker build -f apps/site/Dockerfile .` (94.9MB) + `docker run` servindo em `localhost:8080` com 200 nas rotas, 404 correto, cache imutável em `/_astro/*` e healthcheck "healthy".
- **CP3 (após M4): parcial, 2026-10-01.** CI verde em push real no GitHub (lint/typecheck/test/build). Changesets faz o bump de versão corretamente, mas a abertura do PR "Version Packages" está bloqueada por uma política de org (ver CONTRIBUTING › Setup único). Deploy do Coolify só dispara depois dos secrets serem criados (ver mesma seção).
- **CP4 (após M2 + Button): parcial, 2026-10-01.** Button + Spinner construídos, 100% de cobertura (gate é 85%), build real verificado (ESM + .d.ts + "use client" preservado + CSS com tokens corretos). Falta: publicar no npm de verdade (depende do setup único) e instalar num app Next.js/Vite real para confirmar.

---

## Tasks

### M0: Fundação do repo

- [x] **T0.1: Inicializar monorepo pnpm**
  - Acceptance: `git init` na branch `main`; `package.json` raiz privado com scripts da spec; `pnpm-workspace.yaml` (`apps/*`, `packages/*`); `.nvmrc` (24); `packageManager` fixado; `.gitignore`; `.editorconfig`
  - Verify: `pnpm install` sem erro
  - Files: `package.json`, `pnpm-workspace.yaml`, `.nvmrc`, `.gitignore`, `.editorconfig`

- [x] **T0.2: TypeScript base + Biome**
  - Acceptance: `tsconfig.base.json` strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`); `biome.json` com formatter + linter + organize imports
  - Verify: `pnpm lint` e `pnpm typecheck` rodam
  - Files: `tsconfig.base.json`, `biome.json`, `package.json`

- [x] **T0.3: Commits semânticos**
  - Acceptance: commitlint (`@commitlint/config-conventional`) + lefthook (`commit-msg`, e `pre-commit` com Biome nos arquivos staged)
  - Verify: `git commit -m "bad"` é rejeitado; `git commit -m "chore: init"` passa
  - Files: `commitlint.config.js`, `lefthook.yml`, `package.json`

- [x] **T0.4: Arquivos open source (pt-BR)**
  - Acceptance: `README.md` (o que é, instalação, links), `CONTRIBUTING.md` (setup, fluxo de branch/PR, commits, changesets, como criar um componente, critérios de review), `CODE_OF_CONDUCT.md` (Contributor Covenant), `SECURITY.md`, `LICENSE` (MIT), templates de issue (bug/feature) e de PR
  - Verify: leitura; links relativos válidos
  - Files: arquivos raiz + `.github/ISSUE_TEMPLATE/*`, `.github/pull_request_template.md`

### M1: Esqueleto da lib `@innovui/react`

- [x] **T1.1: Pacote e build**
  - Acceptance: `packages/react/package.json` com `exports` (`.` → ESM + types, `./styles.css`), `peerDependencies` React 19, `sideEffects: ["**/*.css"]`, `files: ["dist"]`; tsdown gerando ESM + `.d.ts` preservando `"use client"` por módulo
  - Verify: `pnpm --filter @innovui/react build`; inspecionar `dist/` (diretiva presente)
  - Files: `packages/react/package.json`, `tsdown.config.ts`, `tsconfig.json`, `src/index.ts`

- [x] **T1.2: Pipeline de CSS (Tailwind v4)**
  - Acceptance: `src/styles/index.css` com `@import "tailwindcss" prefix(iu)` em `@layer innovui`, `@theme` com os **nomes** semânticos dos tokens (valores entram em M2), dark mode por `.dark`/`[data-theme=dark]` e `prefers-color-scheme`; build gera `dist/styles.css`; arquivo de tema importável por quem usa Tailwind
  - Verify: `dist/styles.css` contém só utilitários usados pela lib
  - Files: `src/styles/*.css`, `package.json`

- [x] **T1.3: Vitest + Testing Library + cobertura**
  - Acceptance: `vitest.config.ts` (jsdom, setup com `@testing-library/jest-dom` e `vitest-axe`), coverage v8 com thresholds 85% nas 4 métricas; `cn()` util (`clsx` + `tailwind-merge` com prefixo) com teste
  - Verify: `pnpm test:coverage` verde; baixar um teste propositalmente faz falhar o threshold
  - Files: `vitest.config.ts`, `src/test/setup.ts`, `src/utils/cn.ts`, `src/utils/cn.test.ts`

### M2: Tokens do design system

- [ ] **T2.1: Extrair tokens do Figma**
  - Como: ler as coleções de variáveis pelo Figma MCP (`use_figma` + Plugin API, para pegar **os dois modos** light/dark e os aliases), e não só `get_variable_defs`, que devolve apenas o modo ativo
  - Acceptance: cores (primitivas + semânticas claro/escuro), tipografia (família, escala, pesos, line-height), espaçamento, raios, sombras, breakpoints e motion mapeados 1:1 com as variáveis do Figma em `@theme`
  - Verify: tabela de tokens na doc bate com o Figma (revisão visual sua)
  - Files: `src/styles/tokens.css`, `src/styles/theme.css`

- [x] **T2.2: Inventário de componentes do Figma**: feito em 2026-10-01 (25 componentes, ver tabela de escopo na SPEC)
  - Verify: você aprova o inventário
  - Files: `SPEC.md`

### M3: Site (Astro + Starlight)

- [x] **T3.1: App Astro**
  - Acceptance: `apps/site` com Astro + `@astrojs/react` + Starlight (`lang: pt-BR`, `site: https://innovui.innovtechsolutions.com.br`); consome `@innovui/react` via `workspace:*`; sitemap e meta OG
  - Verify: `pnpm --filter site dev` e `build`; `astro check` sem erro
  - Files: `apps/site/package.json`, `astro.config.mjs`, `tsconfig.json`, `src/content.config.ts`

- [x] **T3.2: Estrutura de docs**
  - Acceptance: páginas "Introdução", "Instalação" (npm/pnpm/bun, Next.js e Vite), "Tema e customização", "Acessibilidade", "Contribuindo"; template MDX de componente (demo viva, código, props, a11y); componente `<PropsTable>` gerado a partir dos tipos *(ou manual na 1ª versão, ver nota)*
  - Verify: navegação e busca (Pagefind) funcionando no build
  - Files: `src/content/docs/**`, `src/components/*`

- [ ] **T3.3: Landing page**
  - Acceptance: LP em `/` com proposta, instalação em 1 comando com botão de copiar, showcase vivo de componentes e CTAs para docs/GitHub. Design feito com `/impeccable` depois de M2 (precisa dos tokens)
  - Verify: Lighthouse ≥ 95 nas 4 categorias
  - Files: `src/pages/index.astro`, `src/components/landing/*`

- [x] **T3.4: Container de produção**
  - Acceptance: `apps/site/Dockerfile` multi-stage (`node:24-alpine` + corepack/pnpm com `pnpm deploy`/filter → `nginx:alpine`), `nginx.conf` com gzip, cache imutável para `/_astro/*`, 404 do Astro, headers de segurança, `HEALTHCHECK`; `.dockerignore`
  - Verify: `docker build -f apps/site/Dockerfile -t innovui-site . && docker run -p 8080:80 innovui-site`
  - Files: `apps/site/Dockerfile`, `apps/site/nginx.conf`, `.dockerignore`

### M4: CI/CD

- [x] **T4.1: CI**
  - Acceptance: `.github/workflows/ci.yml` em PR e push na `main`: pnpm com cache, Node 24, `lint`, `typecheck`, `test:coverage`, `build`; resumo de cobertura no job; `concurrency` cancelando runs antigos
  - Verify: PR de teste no GitHub verde; quebrar um teste deixa vermelho
  - Files: `.github/workflows/ci.yml`

- [x] **T4.2: Release no npm**
  - Acceptance: Changesets configurado (`.changeset/config.json`, changelog com links do GitHub); `release.yml` com `changesets/action` abrindo o PR "Version Packages" e publicando no merge com `--provenance`; `permissions: id-token: write`
  - Verify: changeset de teste abre PR de versão; merge publica `0.0.1` (primeira vez com `NPM_TOKEN`)
  - Files: `.changeset/config.json`, `.github/workflows/release.yml`, `package.json`

- [x] **T4.3: Deploy do site no Coolify**
  - Acceptance: `deploy-site.yml` em push na `main` com `paths: apps/site/**, packages/react/**`, rodando só após o CI verde; `curl -fsS --retry 3 -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}" "${{ secrets.COOLIFY_WEBHOOK }}"`; doc no CONTRIBUTING de como configurar o app no Coolify (Dockerfile path, domínio, healthcheck)
  - Verify: push na `main` dispara deploy visível no Coolify
  - Files: `.github/workflows/deploy-site.yml`, `CONTRIBUTING.md`

### M5+: Componentes (task repetível por componente)

Cada componente da tabela de fases da spec vira uma task com este molde:

- [ ] **T5.x: `<Componente>`**
  - Acceptance: fiel ao Figma (variantes/tamanhos/estados) ou, se derivado (fase 4), só com tokens do DS e selo na doc; props tipadas estendendo o elemento nativo; `className` + `ref`; teclado e ARIA corretos (Radix quando for overlay/composto); exportado no barrel; changeset `minor`; página MDX em pt-BR com demo, props e notas de a11y
  - Verify: `pnpm test:coverage` (≥ 85%, axe sem violações) + revisão visual na doc contra o Figma
  - Files: `packages/react/src/components/<nome>/*`, `src/index.ts`, `apps/site/src/content/docs/components/<nome>.mdx`, `.changeset/*`

- [x] **Button (piloto):** feito em 2026-10-01, junto com o Spinner (dependência da Button para o estado loading). Falta a página de doc (depende de M3) e o publish real no npm.

**Ordem:** ~~Button (piloto, fecha o CP4)~~ → resto da Fase 1 → Fase 2 → Fase 3 → v1.0.0 → Fase 4.

---

## Decisões

Todas validadas em 2026-10-01 (ver SPEC › Decisões tomadas). Pendência externa: criar a org `innovui` no npm antes de T4.2.
