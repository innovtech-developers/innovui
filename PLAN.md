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
- **CP4 (após M2 + Button): ✅ feito 2026-10-19.** `@innovui/react@0.2.0` publicado no npm via PR "Version Packages" + Trusted Publisher (OIDC, sem token). Instalado do npm em apps novos, fora do monorepo: **Next.js 16** (App Router, usando Button/IconButton/Input/Switch/Select direto num Server Component, sem `"use client"` no app: `next build` e typecheck passam, HTML pré-renderizado com as classes `iu:`, CSS com os tokens) e **Vite 8** (`vite build` + `tsc --noEmit` passam; o import de `styles.css` só precisa de `vite/client` types, como em qualquer app Vite). Consumidor com Tailwind v4 testado em 2026-10-19 (ver abaixo).

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

- [x] **T2.1: Extrair tokens do Figma**: tokens do modo claro entraram junto de cada componente; **modo escuro feito em 2026-10-19**. Leitura direta das coleções Semantic (48) e Component (120) pelo `use_figma` (os dois modos, com aliases resolvidos), cruzada com os `Light/Dark.tokens.json` exportados (idênticos). Os 89 tokens `--color-*` do `tokens.css` já batiam 100% com o Light do Figma; o bloco `.dark, [data-theme="dark"]` sobrescreve os mesmos 89 nomes com os valores Dark, mais `--surface-overlay-opacity` (0.5 → 0.7) e `color-scheme: dark`. Sem ativação automática por `prefers-color-scheme` (decisão: opt-in). Teste de completude em `src/styles/tokens.test.ts`. Site: seletor de tema do Starlight restaurado e `herbarium.css`/demos tokenizados (o site e os portais trocam juntos).
  - **Divergência PDF ↔ Figma:** o PDF "Dark Mode — como funciona" difere das variáveis do Figma em dezenas de pares (ex.: `text/secondary` Dark gray/300 no PDF vs gray/400 no Figma; `text/success` Light green/900 vs green/600; `bg/primary` Light gray/50 vs white). Seguimos o Figma (o próprio PDF diz que o Figma prevalece); o PDF afirma que os pares de texto têm 4.5:1+, mas com os valores do Figma 9 pares ficam abaixo (listados em `/acessibilidade`). Se o PDF for a intenção, basta atualizar as variáveis e re-sincronizar.
  - Verify: `pnpm test:coverage` (tokens.test.ts) e revisão visual nos dois modos (pendente).
  - Files: `src/styles/tokens.css`, `src/styles/tokens.test.ts`
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

- [x] **T3.3: Landing page**: feito em 2026-10-02 via `/impeccable` (mundo "herbário de espécimes", ver `apps/site/.impeccable/surfaces/`). LP em `/` com proposta, instalação em 1 comando com botão de copiar, showcase vivo do Button real (specimen plate interativo) e CTAs para docs/GitHub. Passou por 2 rounds de finish-review (subagent) contra o direction contract (6/8 achados corrigidos e reverificados) + uma rodada de polimento dos 3 itens cosméticos restantes: os 4 pictogramas foram redesenhados (broto+etiqueta, enxerto, guia de campo aberto, broto com raízes) em 4rem, a fita de montagem agora é SVG com borda rasgada (não mais retângulo CSS liso), e o seletor de tema "Auto" foi removido (sem tokens de dark mode reais, o controle não mudava nada).
  - Verify: Lighthouse ainda não rodado — pendente.
  - Files: `src/content/docs/index.mdx`, `src/components/HerbariumHero.astro`, `src/components/SpecimenPlate.tsx`, `src/components/Install{Command,Snippet}.astro`, `src/styles/herbarium.css`

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

- [x] **Button (piloto):** feito em 2026-10-01, junto com o Spinner (dependência da Button para o estado loading). Tem página de doc (`/components/button`). Falta o publish real no npm.
- [x] **Input, Field, Textarea, Checkbox, Radio, Switch:** feito em 2026-10-02, resto da Fase 1 (Form Controls). Tamanhos/geometria reais do Figma (não da doc simplificada): Input/Textarea 56/48/40px, Checkbox/Radio caixa de 20px em alvo de toque de 44px, Switch trilho 44×24 com knob de 20px. 100%/98.55% de cobertura. Página de doc com demo ao vivo para cada um (ex.: Field com validação ao vivo, Checkbox com padrão selecionar-todos/indeterminate).
- [x] **Select:** feito em 2026-10-05, fecha a Fase 1 (Form Controls). Construído sobre `@radix-ui/react-select` (Trigger + Dropdown + Option do Figma viram, na API pública, só `Select` + `SelectOption` — o resto é composição interna). Tamanhos 56/48/40px idênticos ao Input; estados Default/Hover/Focus/Open/Error/Disabled herdam os tokens `--color-field-*` já existentes; `select/option/*` e `select/dropdown/*` viraram tokens novos (`--color-select-*`). `readOnly` implementado via `open` controlado internamente (foco normal, nunca abre), já que Radix não tem esse conceito nativo. 100%/98.7% de cobertura. Doc com demo de tamanhos, estados e uso com `Field`.
- [x] **IconButton:** feito em 2026-10-19, fecha a Fase 1 (Actions e Form). Verificado no Figma (componente `576:232`): mesmos 5 estilos × 6 estados e tokens do Button, container quadrado 56/44/36px com ícone 24/20/16px. Componente próprio (não prop do Button) para o TypeScript exigir `aria-label`; reaproveita `buttonBase`/`buttonVariantStyles` do Button; ícone entra como `children`. 100% de cobertura. Doc em `/components/icon-button`.
- [x] **Badge, Tag:** feito em 2026-10-19, início da Fase 2 (Feedback). Badge: 6 status (success/error/warning/info/neutral/pending) × dot opcional, pill 20px (px 8, py 2, texto 12/16 medium); Tag: filled/outline, raio 4px, removível via `onDismiss` (botão × de 16px). Tokens `--color-status-*` já existiam; só `status-pending-*` foi adicionado (valores do Figma). Docs em `/components/badge` e `/components/tag`.
- [x] **Alert, Banner:** feito em 2026-10-19, Fase 2 (Feedback). 5 status (success/error/warning/info/neutral), ícones semânticos de 20px (traço do Figma, em `_shared/status.tsx`, reaproveitado pela Tag e futuramente pelo Toast), fechar via `IconButton` ghost `sm` (é isso que o Figma usa). Alert: borda lateral de 3px + fundo, título opcional, `action` como slot. Banner: largura total, sem borda/raio. `role="alert"` para error/warning e `role="status"` para o resto. Desvio: a `action` do Figma é um ghost de 36px com texto 14px semibold; usamos Button ghost `sm` (36px, texto 12px) por reaproveitamento. Docs em `/components/alert` e `/components/banner`.
- [x] **Toast:** feito em 2026-10-19, Fase 2 (Feedback). Sobre `@radix-ui/react-toast` (viewport, timer com pausa, swipe, F8, aria). API por código: `ToastProvider` + `useToast()` com `toast({status, title, description, action, duration})` e `dismiss(id)` (o Toast do Figma é só o cartão; o disparo é nosso). Posição: canto inferior direito (o Figma não define). Desvio do Figma: o cartão não tem fundo na variante (só borda e sombra), então usamos `surface/elevated` + `shadow-md`, como a spec prevê para componentes flutuantes. Sem animação de entrada/saída por enquanto. Docs em `/components/toast`.
- [x] **Skeleton:** feito em 2026-10-19, **fecha a Fase 2 (Feedback e Loading)**. 5 variantes do Figma (text 200×12 r4, title 160×20 r4, avatar 40 circular, card 300×120 r8, rectangle 200×24 r8), fundo `--color-bg-skeleton`, `animate-pulse` nativo do Tailwind (desligado com `prefers-reduced-motion`), `aria-hidden` (decorativo; `aria-busy` fica no contêiner). Divergência dentro do Figma: o PDF diz que o Card tem `radius/lg` (12px), mas o componente real usa `radius/md` (8px); seguimos o componente. Dimensões padrão sobrescritíveis por `className`. Docs em `/components/skeleton`.
- [x] **Tabs, SegmentedControl:** feito em 2026-10-19, início da Fase 3 (Navegação). Tabs sobre `@radix-ui/react-tabs` (API composta `Tabs`/`TabList`/`Tab`/`TabPanel`; Tab com padding 8/12, indicador de 2px, `icon` opcional de 24px; ativo em `text/brand` medium, hover em `interactive/primary-hover`). SegmentedControl sobre `@radix-ui/react-radio-group` (semântica de escolha única: `radiogroup`, setas escolhem, não desmarca): contêiner `bg/tertiary` p4 gap4 r8, item px16 py8 r8. Sem tokens novos (tudo em `--color-text-*`, `--color-bg-*`, `--color-interactive-*`). Pendente de revisão no Figma: o fundo do item ativo do Segmented não vem no código do Figma (só na doc: "fundo sólido"), usamos `bg/primary`; e hover do Segmented sem mudança visual (o Figma não define). Docs em `/components/tabs` e `/components/segmented-control`.
- [x] **Stepper, Breadcrumb:** feito em 2026-10-19, Fase 3 (Navegação). Stepper: `Stepper current={n}` + `Step` (estado concluído/ativo/pendente derivado da posição; indicador de 28px, ✓ verde em `bg/success-emphasis`, número em 13px bold, `aria-current="step"`). Breadcrumb: `Breadcrumb` (nav+ol) + `BreadcrumbItem` (`href`, `current`, `asChild` via `@radix-ui/react-slot` para links de roteador). Tokens novos: só `--color-bg-success-emphasis` (#47c559, variável do Figma). Divergências do PDF: o separador do Breadcrumb é um chevron › de 12px (o PDF diz "/"); o componente real prevalece. Decisões minhas, sem Figma: o espaçamento entre passos do Stepper (gap de 32px; o Figma só tem o Step, sem container, nem conectores) e esconder o separador depois do último item do Breadcrumb. Contraste do passo pendente fica abaixo de 4.5:1 por fidelidade ao Figma (documentado). Docs em `/components/stepper` e `/components/breadcrumb`.
- [x] **Tooltip, Modal:** feito em 2026-10-19, **fecha a Fase 3 (Navegação e Overlay)**. Tooltip sobre `@radix-ui/react-tooltip`: `<Tooltip content title side showArrow>` envolvendo o trigger; fundo `bg/inverse`, padding 8/12, texto 12/16 (título 13 medium), seta 8×5, delay 200ms, max-width 240px. Modal sobre `@radix-ui/react-dialog`: `<Modal title footer trigger size showClose>` + `ModalClose`; cabeçalho (título 18/24 semibold + × como IconButton ghost sm), corpo p24, rodapé px24 py16 alinhado à direita, divisores, raio 12, `shadow-2xl`, larguras 480/640/800; backdrop `surface/overlay` a 50% (token novo `--color-surface-overlay`, #10172b). Divergências do PDF (o componente real prevaleceu): Tooltip com raio `sm` (4px, não 8px) e seta 8×5 (não 8×4); Backdrop em `#10172b` (não `#000`). A opacidade de 50% do Backdrop veio do PDF e da cor renderizada, não do código do Figma (confirmar). Desvios: o padding dos botões do rodapé do Figma (px24 py12) não existe no Button; usamos Button md (px16). Docs em `/components/tooltip` e `/components/modal`.

- **Teste com Tailwind v4 do consumidor (2026-10-19):** pacote local empacotado (`pnpm pack`) e instalado em 3 apps: Vite sem Tailwind (base), Vite + Tailwind v4 (nas duas ordens de import) e Next.js 16 + Tailwind v4 com a página inteira como Server Component. `@theme` do consumidor sobrescrevendo `--spacing`, `--radius-md`, `--radius-full`, `--font-sans`, `--color-gray-50`, `--text-sm`. Resultado: estilo computado de 23 componentes idêntico à base (só a fonte herdada muda quando o Tailwind vem depois da lib); `className` sem conflito (`mt-4 w-full`) funciona; `className` que conflita (`h-20` vs `iu:h-11`) depende da ordem de import (lib antes do Tailwind = consumidor vence). Achado e corrigido: `Stepper` usava `createContext` sem `'use client'` e quebrava o `next build` com a página em Server Component; agora há um teste (`components/use-client.test.ts`) que exige a diretiva em todo arquivo que usa hooks/contexto/Radix.

**Ordem:** ~~Button (piloto, fecha o CP4)~~ → ~~resto da Fase 1~~ → ~~Fase 2~~ → ~~Fase 3~~ → v1.0.0 → Fase 4.

---

## Decisões

Todas validadas em 2026-10-01 (ver SPEC › Decisões tomadas). Pendência externa: criar a org `innovui` no npm antes de T4.2.
