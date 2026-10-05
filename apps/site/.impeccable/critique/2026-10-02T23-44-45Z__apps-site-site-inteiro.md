---
target: site inteiro (nav + docs)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:/Users/lucasbogos/Developer/innovui/apps/site/apps/site (site inteiro)"
timestamp: 2026-10-02T23-44-45Z
slug: apps-site-site-inteiro
---
# Critique — InnovUI (site inteiro: nav + docs)

Nenhuma automação de browser disponível nesta sessão — evidência é leitura de código + matemática de contraste sRGB, não observação visual.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Botão "copiar comando" só muda aria-label — zero feedback visível |
| 2 | Match System / Real World | 3 | Metáfora do herbário sempre pareada com termo literal |
| 3 | User Control and Freedom | 3 | Nenhuma ação destrutiva/trap encontrada |
| 4 | Consistency and Standards | 2 | Hero teatral vs. páginas de componente planas; bug de heading em button.mdx |
| 5 | Error Prevention | 3 | Validação de e-mail ao vivo bem amarrada |
| 6 | Recognition Rather Than Recall | 4 | Tabelas de props + cross-links consistentes |
| 7 | Flexibility and Efficiency | 2 | Tabs de package manager sincronizadas; nada além disso |
| 8 | Aesthetic and Minimalist Design | 3 | Hero rico mas controlado; docs minimalistas, graus diferentes |
| 9 | Error Recovery | 3 | Único momento de erro testado é bem tratado |
| 10 | Help and Documentation | 3 | editLink + seções por página; sem changelog visível |
| **Total** | | **29/40** | **Good** |

## Design Specificity Verdict
Landing page é genuinamente autoral (pictogramas à mão, 3 vozes tipográficas, SpecimenPlate reativo de verdade). Especificidade para na home — páginas de componente perdem a voz do herbário e viram Starlight genérico. Deterministic scan: 2 findings (overused-font/Fraunces, já aceito pelo brief), 7 páginas com description completo, 21 cores hex disciplinadas, 0 TODO/FIXME.

## Priority Issues

[P0] SpecimenPlate's flagship interaction can render an invisible button — .specimen-plate__mount pinta sobre #f0ddb0, não branco; variant="tertiary" cai a ~1.1:1 de contraste de borda; "ghost" fica ~4:1, abaixo de AA. Fix: fundo branco na área de montagem do botão. Command: /impeccable harden

[P1] Install-command copy button sem feedback visível — InstallSnippet.astro só troca aria-label. Fix: check/flash visual por ~1.5s. Command: /impeccable polish

[P1] Heading-hierarchy bug em button.mdx — Quando usar/Quando não usar aninhados como H3 sob Acessibilidade, diferente de todas as páginas irmãs. Fix: promover a H2, mover antes de Acessibilidade. Command: /impeccable clarify

[P2] Visual-intensity drop-off entre home e páginas de componente — sem brief registrado para essas páginas. Fix: decisão explícita de direction mais leve para Read mode, ou levar motivo mínimo do herbário. Command: /impeccable adapt

[P2] SpecimenPlate live updates invisíveis para leitor de tela — sem aria-live no toggle/readout. Fix: aria-live="polite" na região de leitura de tokens. Command: /impeccable harden

## Persona Red Flags
Jordan: esbarra no P0 na primeira interação + P1 sem confirmação de cópia. Sam: bug de heading do P1 + leitura muda do SpecimenPlate. Alex: tabs sincronizadas ajudam, mas nada mais construído para eficiência.

## Minor Observations
field.mdx sem seção "Quando usar"; index.mdx com pagefind:false (provavelmente intencional); carimbo do SpecimenPlate sem link de verificação (changelog/Figma).
