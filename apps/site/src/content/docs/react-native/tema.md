---
title: Tema e modo escuro
description: Como os tokens do InnovUI funcionam no React Native e como trocar entre claro e escuro.
---

Os tokens do design system vêm de um arquivo de origem único. O `@innovui/react-native/theme.css` define cada token como uma variável por tema (`light` e `dark`), e cada variável vira um utilitário do Tailwind, que você também pode usar no seu código: `--color-button-primary-bg` vira `bg-button-primary-bg`.

```tsx
import { Text, View } from 'react-native'

<View className="bg-bg-secondary p-4">
  <Text className="text-text-primary">Texto com tokens do design system</Text>
</View>
```

## Modo escuro

Os componentes não têm variante "dark": cada token resolve para o valor do modo escuro quando o tema muda. Troque o tema com o Uniwind:

```tsx
import { Uniwind } from 'uniwind'

Uniwind.setTheme('dark') // escuro fixo
Uniwind.setTheme('light') // claro fixo
Uniwind.setTheme('system') // segue o aparelho
```

Para ler o tema atual e re-renderizar quando ele mudar, use `useUniwind`:

```tsx
import { Uniwind, useUniwind } from 'uniwind'

function ThemeToggle() {
  const { theme } = useUniwind()
  return (
    <Button onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
    </Button>
  )
}
```

Ao definir `light` ou `dark`, o Uniwind também ajusta o esquema de cores do React Native, então `Alert` e `Modal` nativos acompanham o tema.

## className

Todo componente aceita `className` e mescla com as classes internas sem conflito (usamos `tailwind-merge`). A sua classe vence quando conflita:

```tsx
<Button className="mt-4 h-16">Continuar</Button>
```

## Customizando os tokens

Sobrescreva uma variável no seu `global.css`, **depois** do import do `theme.css`, dentro dos dois temas:

```css title="global.css"
@import '@innovui/react-native/theme.css';

@layer theme {
  :root {
    @variant light {
      --color-button-primary-bg: #0ea5e9;
    }

    @variant dark {
      --color-button-primary-bg: #38bdf8;
    }
  }
}
```

Cores que não aceitam `className` (como a cor de um ícone SVG) podem ser lidas com `useCSSVariable('--color-nome-do-token')`, do Uniwind.

## Limitações

- O tema é trocado por `Uniwind.setTheme`; o modo `system` acompanha o do aparelho.
- Não há blur no fundo de Modal e Drawer.
- As sombras (`shadow-*`) não geram `elevation` no Android.
