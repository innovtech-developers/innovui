---
name: InnovUI site
description: O site de documentação/landing da InnovUI — modo claro, usando os tokens reais do design system.
colors:
  purple-600: "#9035ee"
  purple-700: "#7b24d1"
  purple-800: "#6822ab"
  purple-900: "#561d89"
  purple-100: "#f2e8ff"
  purple-50: "#faf5ff"
  gray-900: "#10172b"
  gray-600: "#49556a"
  gray-500: "#66748c"
  gray-200: "#e3e8f0"
  gray-100: "#f1f5f9"
  gray-50: "#f8fafc"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
  label:
    fontFamily: "Space Mono, ui-monospace, monospace"
rounded:
  sm: "8px"
  md: "12px"
  pill: "9999px"
spacing:
  card-padding: "1.5rem"
  plate-padding: "2rem"
components:
  lp-button-primary:
    backgroundColor: "{colors.purple-600}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "2.75rem"
  lp-button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.purple-700}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "2.75rem"
  specimen-demo-card:
    backgroundColor: "{colors.gray-50}"
    rounded: "{rounded.sm}"
    padding: "{spacing.card-padding}"
  code-block:
    backgroundColor: "{colors.gray-900}"
    textColor: "#d6deeb"
    rounded: "0px"
    padding: "0.75rem 1rem"
  site-title:
    textColor: "{colors.purple-600}"
    typography: "{typography.display}"
---

# Design System: InnovUI site

## Overview

**Creative North Star: "The Living Spec Sheet"**

O site é a própria documentação do Comhub Design System renderizada com seus próprios tokens — nenhuma paleta, fonte ou metáfora inventada só para a casca do site. Onde a versão anterior vestia uma metáfora de papel kraft/herbário por cima dos componentes, esta versão não veste nada: a página é uma superfície clara e neutra (branco/cinza muito claro), e o roxo da marca Comhub (`purple/600`) é o único elemento de cor com autoridade. A clareza vem de hierarquia por espaço em branco, borda fina e sombra discreta — no espírito da documentação de design system que o MUI pratica bem, sem reproduzir sua paleta azul/indigo nem sua tipografia.

A personalidade é **direta e técnica**: cada superfície existe para deixar o componente real de pé e legível, nunca para competir com ele visualmente. Leituras de token (`dl` de medidas, chips de variant/size) continuam em mono — não por capricho decorativo, mas porque é assim que um spec sheet real mostra dado.

Anti-referências explicitamente rejeitadas: o mundo kraft/papel/carimbo da versão anterior (fundo bege saturado, serifa display, fita adesiva desenhada, carimbo rotacionado) — descartado por decisão do usuário, não refinado. Também rejeitado: clonar a paleta azul/indigo e a tipografia do MUI — o MUI é referência de clareza estrutural, não de marca.

**Key Characteristics:**
- Superfícies claras (branco + cinza muito claro), nunca um bloco de cor saturada como fundo de página
- Roxo Comhub (`#9035ee`) reservado para ação primária, link, foco e seleção — nunca decoração passiva
- Uma única voz tipográfica para prosa e display (Inter), mais mono só para metadado/código
- Cantos levemente arredondados (8–12px) em cards; pílula total (9999px) só em controles de ação
- Elevação mínima: borda de 1px + sombra muito suave; nunca sombra decorativa em controle comum

## Colors

Paleta neutra (branco/cinza) com um único acento: o roxo real da marca Comhub.

### Primary
- **Purple 600** (#9035ee): cor de marca (`purple/600`, mesma do pacote `@innovui/react`). Ação primária, link, foco, chip selecionado. Passa AA (5.3:1) como texto sobre branco.
- **Purple 700** (#7b24d1): hover do primary, texto de maior ênfase onde 600 já não é suficiente.
- **Purple 900 / 800**: reservados para casos pontuais de contraste alto (não usados em texto corrido hoje).

### Neutral
- **White** (#ffffff): fundo de página, nav e sidebar — superfície única, sem bloco de cor separando chrome de conteúdo.
- **Gray 50** (#f8fafc): fundo dos cards de demo e da Specimen Plate — a única variação de superfície, para dar profundidade sem introduzir uma segunda cor.
- **Gray 100** (#f1f5f9): fundo de `code` inline.
- **Gray 200** (#e3e8f0): toda borda/divisor (`--sl-color-hairline`) — mesmo tom do `border-color` do Button `tertiary` real, não inventado para o site.
- **Gray 600 / 500**: texto secundário e rótulos de metadado, respectivamente.
- **Gray 900** (#10172b): texto estrutural (corpo, headings, ícones de pictograma).

### Named Rules
**The Dogfood Rule.** Toda cor do site vem da escala real de `@innovui/react/src/styles/tokens.css` (purple/gray). Nenhuma cor é escolhida só para o site — se não existe como token do design system, não entra na página que documenta esse design system.

## Typography

**Display e Body Font:** Inter (variável), mesma fonte que `--font-sans` do pacote `@innovui/react`.
**Label/Mono Font:** Space Mono (mantido da versão anterior — convenção comum e correta para metadado/código, não é um traço "kraft").

### Hierarchy
- **Display** (H1/H2/H3, Inter 700, `letter-spacing: -0.02em`): título do hero, nome de cada página de componente, headings de seção.
- **Body** (Inter 400): toda prosa.
- **Label** (Space Mono, caixa alta, `letter-spacing` 0.04–0.08em): rótulos de metadado (variant/size/token na Specimen Plate), carimbo "Comhub DS v2.1", legend dos controles.

### Named Rules
**One Voice Rule.** Prosa e display usam a mesma família (Inter), diferenciados por peso e tamanho — não por fonte. Mono nunca aparece fora de metadado/código.

## Layout

Sem alteração estrutural da versão anterior: página fluida com `clamp()`, hero em grid de duas colunas que colapsa para uma coluna abaixo de 62rem. `min-width: 0` em todo item de grid/flex para nunca forçar scroll horizontal (herdado; já não depende de `transform: rotate()`, que foi removido da Specimen Plate).

## Elevation & Depth

Elevação mínima e uniforme — nenhum "objeto físico" fingindo estar sobre uma mesa.

### Shadow Vocabulary
- **Plate lift** (`box-shadow: 0 1px 2px rgb(16 23 43 / 0.04), 0 16px 32px -16px rgb(16 23 43 / 0.18)`): única sombra dupla do site, na Specimen Plate do hero.
- **Demo card**: sem sombra — só borda de 1px + fundo Gray 50. Suficiente para separar do branco da página sem imitar profundidade física.

### Named Rules
**Flat by Default.** Nenhum controle comum (botão, input, chip) recebe sombra. Só a Specimen Plate do hero recebe elevação, e mesmo essa é discreta — nunca a dupla sombra "papel levantado" da versão anterior.

## Shapes

Um único registro de canto para cards (8–12px), e pílula total (9999px) só em controles de ação (botões, chips da Specimen Plate). Bordas sempre `1px solid`, cor Gray 200.

## Components

### Specimen Plate (hero)
Um `<Button>` real montado, com carimbo de versão, leitura `<dl>` de medidas ao vivo e chips para alternar variant/size.
- **Shape:** `border-radius: 12px`, sem rotação.
- **Background:** Gray 50; a área de montagem do botão (`.specimen-plate__mount`) é branca com borda de 8px, para o próprio Button (desenhado para fundo claro) nunca perder contorno.
- **Shadow:** Plate lift.
- **Stamp:** pílula Purple 100 / texto Purple 700, nunca mais o carimbo rotacionado com borda 1.5px.

### Specimen Demo Card
Fundo de toda demo React viva nas páginas de componente.
- **Background:** Gray 50 sólido.
- **Border:** 1px Gray 200, `border-radius: 8px`.
- **Shadow:** nenhuma.

### Buttons (landing page)
Primary e ghost, replicando as variantes reais do `@innovui/react` Button para os CTAs (que precisam ser `<a>`, não o componente).
- **Shape:** pílula total (9999px).
- **Primary:** fundo Purple 600, texto branco; hover Purple 700.
- **Ghost:** fundo transparente, texto Purple 700, borda Gray 200; hover fundo Purple 100 + borda Purple 600.

### Nav Title (site-title)
A marca no cabeçalho — agora Inter 800, a mesma família do resto do site (sem voz mono separada; o mono fica reservado para metadado real).

### Component Category Pictograms
Inalterados: um ícone desenhado à mão por categoria, ao lado do H1. Cor Purple 600.

### Install Ticket
Ficha de instalação copiável abaixo do hero.
- **Background:** Gray 50, `border-radius: 8px`, borda 1px Gray 200.
- **Copy button hover:** borda e texto Purple 600/700.

### Code Blocks
Tema escuro (Night Owl, via Expressive Code) mantido mesmo em página clara — nenhum tema de sintaxe claro tem contraste suficiente em todas as categorias de token. Casca retintada para Gray 900 em vez do azul-marinho padrão; cores de sintaxe do tema não são tocadas.

## Do's and Don'ts

### Do:
- **Do** puxar toda cor do site da escala real de tokens do `@innovui/react` (Dogfood Rule) — nunca inventar um tom "só para o marketing".
- **Do** manter Gray 50 como única superfície secundária — não introduzir uma segunda cor de fundo para "dar variedade".
- **Do** manter o roxo reservado a estado ativo/interativo — mesmo princípio da versão anterior, agora sem a ressalva de contraste sobre fundo escuro (o roxo puro já fecha AA sobre branco).

### Don't:
- **Don't** reintroduzir sombra em controle comum (botão, input, chip) — só a Specimen Plate do hero tem elevação.
- **Don't** copiar a paleta azul/indigo ou a tipografia padrão do MUI — a referência é a clareza estrutural, não a marca.
- **Don't** misturar Inter com qualquer serifa de exibição — a voz única (Inter) é deliberada, não uma lacuna a preencher.
