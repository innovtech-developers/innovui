---
title: Tema e customização
description: Como os tokens de design do InnovUI funcionam e como customizá-los.
---

Os componentes usam [CSS custom properties](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties) para cor, nunca valores fixos. Isso significa que você pode sobrescrever qualquer token no seu próprio CSS, depois de importar `@innovui/react/styles.css`:

```css
:root {
  --color-button-primary-bg: #0ea5e9;
  --color-button-primary-bg-hover: #0284c7;
}
```

## Trocar a cor só em um lugar

Um token sobrescrito em `:root` vale para o app inteiro. Para mudar só uma parte, sobrescreva dentro de um elemento: os componentes dentro dele herdam o valor.

```css
.player-da-marca {
  --color-button-primary-bg: #0ea5e9;
  --color-button-primary-bg-hover: #0284c7;
  --color-button-primary-bg-active: #0369a1;
}
```

```tsx
<div className="player-da-marca">
  <AudioPlayer src="/audios/mensagem.m4a" />
</div>

// ou direto no elemento, sem CSS (em TypeScript, o objeto precisa do `as CSSProperties`)
<div style={{ '--color-button-primary-bg': '#0ea5e9' } as CSSProperties}>…</div>
```

Quando um token tem versões `-hover` e `-active`, troque as três juntas, senão o hover volta para a cor antiga. No escuro, repita o bloco dentro de `.dark .player-da-marca`.

## Tokens de mídia

Os componentes de [Mídia](/react/components/audio-player/) usam os tokens do design system e mais quatro próprios. Eles têm o mesmo valor nos dois temas, exceto a onda em repouso:

| Token | Claro | Escuro | Usado em |
|---|---|---|---|
| `--color-media-wave-rest` | `#ccd5e2` | `#66748c` | Barras da onda ainda não tocadas (AudioPlayer) |
| `--color-media-accent` | `#bd84ff` | `#bd84ff` | Parte preenchida das barras de posição e de volume (VideoPlayer) |
| `--color-media-surface` | `#000000` | `#000000` | Fundo do vídeo, véu dos controles e escurecimento da miniatura da Gallery |
| `--color-media-on-surface` | `#ffffff` | `#ffffff` | Ícones e textos sobre o vídeo, a foto ou o botão primário |

Para ver qual token pinta cada parte, veja a seção "Personalização" de [AudioPlayer](/react/components/audio-player/#personalização) e [VideoPlayer](/react/components/video-player/#personalização).

## className e Tailwind

Todo componente aceita `className` e mescla com as classes internas sem conflito (usamos [tailwind-merge](https://github.com/dcastil/tailwind-merge) por baixo dos panos):

```tsx
<Button className="mt-4 w-full">Continuar</Button>
```

As classes internas dos componentes usam o prefixo `iu:` (ex.: `iu:bg-...`), então não colidem com o Tailwind do seu próprio projeto — você não precisa se preocupar com isso, é só uma invisível nos bastidores.

## Modo escuro

O modo escuro **não é um tema paralelo**: são os mesmos componentes, só que cada token (semântico e de componente) resolve para o seu valor do modo Dark do design system. Nenhum componente tem variante "dark".

Para ativar, ponha `class="dark"` ou `data-theme="dark"` no `<html>` (ou em qualquer elemento: o tema vale para tudo que está dentro dele):

```html
<html class="dark">
```

```tsx
// Next.js (App Router): layout.tsx
<html lang="pt-BR" className={theme === 'dark' ? 'dark' : undefined}>
```

O InnovUI **não ativa o escuro sozinho** pela preferência do sistema (`prefers-color-scheme`): a escolha é do seu app. Para seguir o sistema, alterne a classe com um pouco de JavaScript:

```ts
const query = window.matchMedia('(prefers-color-scheme: dark)')
const apply = () => document.documentElement.classList.toggle('dark', query.matches)
apply()
query.addEventListener('change', apply)
```

Os componentes que abrem em portal (Toast, Modal, Tooltip, Select) renderizam no `<body>`, então a classe precisa estar no `<html>` ou no `<body>` para que eles acompanhem o tema.

### Customizando o escuro

Sobrescreva o token dentro do mesmo seletor do tema:

```css
:root {
  --color-button-primary-bg: #0ea5e9;
}

.dark {
  --color-button-primary-bg: #38bdf8;
}
```

### Regras do design system

- **Não** aplique o hex de uma primitiva direto no componente "para o dark funcionar": isso quebra a resolução por modo. Use o token semântico ou de componente.
- Na elevação, a profundidade vem de superfícies mais claras (`surface/elevated` sobre `surface/primary` sobre `bg/primary`), não de sombra: sombras quase não aparecem no escuro.
- Fotos e ilustrações não invertem no escuro.
- O fundo do Modal (`surface/overlay`) fica mais opaco no escuro: 70%, contra 50% no claro.

O site de documentação também segue o tema: use o seletor de tema no topo da página.
