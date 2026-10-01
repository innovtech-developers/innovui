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

## className e Tailwind

Todo componente aceita `className` e mescla com as classes internas sem conflito (usamos [tailwind-merge](https://github.com/dcastil/tailwind-merge) por baixo dos panos):

```tsx
<Button className="mt-4 w-full">Continuar</Button>
```

As classes internas dos componentes usam o prefixo `iu:` (ex.: `iu:bg-...`), então não colidem com o Tailwind do seu próprio projeto — você não precisa se preocupar com isso, é só uma invisível nos bastidores.

## Modo escuro

A estrutura de tokens para modo escuro já existe no design system, mas os valores ainda não foram publicados nesta versão. Acompanhe o [changelog](https://github.com/innovtech-developers/innovui/releases).
