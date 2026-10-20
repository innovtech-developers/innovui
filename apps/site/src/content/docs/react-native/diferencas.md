---
title: Diferenças em relação à web
description: O que muda no uso do @innovui/react-native em comparação com o @innovui/react.
---

Os componentes têm os mesmos nomes e o mesmo visual, e a maioria das props visuais (`variant`, `size`, `error`, `loading`, `disabled`...) é igual. O que muda é a plataforma. O código escrito para a web **não roda sem ajustes** no React Native.

## Setup

|  | Web | React Native |
|---|---|---|
| Pacote | `@innovui/react` | `@innovui/react-native` |
| Estilos | `import '@innovui/react/styles.css'` | `theme.css` + `@source` no `global.css`, `withUniwindConfig` no Metro |
| Tema escuro | classe `dark` ou `data-theme="dark"` no HTML | `Uniwind.setTheme('light' \| 'dark' \| 'system')` |
| Dependências extras | nenhuma | `uniwind`, `tailwindcss`, `react-native-svg` |

## Props e eventos

| Web | React Native |
|---|---|
| `onClick` | `onPress` |
| `onChange` (input) | `onChangeText` |
| `onChange` (checkbox, radio, switch) | `onCheckedChange(boolean)` |
| `aria-label`, `aria-*` | `accessibilityLabel`, `accessibilityState`, `accessibilityHint`... |
| `href` | `onPress`; no `Link`, `href` abre com `Linking.openURL` |
| `asChild` | não existe (veja abaixo) |
| hover, foco por teclado | não existem; o toque usa `active:` |

## Gatilhos (Modal, Drawer, Popover, Menu, Tooltip)

Não existe `asChild`. O gatilho é um elemento React que recebe `onPress` por clonagem, então precisa aceitar essa prop (como o `Button`). O `Tooltip` abre com toque longo (`onLongPress`), porque o toque não tem hover.

```tsx
<Popover label="Detalhes" trigger={<Button variant="tertiary">Abrir</Button>}>
  <Text>Conteúdo</Text>
</Popover>
```

## Texto

No React Native o texto não herda cor nem tamanho do pai. Por isso, alguns componentes aceitam apenas `string` onde a versão web aceita `ReactNode`: Badge, Tag, `title` do Alert, `title` e `description` do Toast, e `MenuItem` e `MenuLabel`. Quando o componente aceita outros nós, você estiliza o `Text` por conta própria (por exemplo, `text-text-primary`).

## Ícones

Não há `currentColor`. Ícones SVG recebem a cor por uma prop `color`. Para usar um token, leia o valor com `useCSSVariable`, do Uniwind.

## Componentes que mudam mais

- **Upload:** o React Native não tem `<input type="file">`. O componente é controlado: você abre o seletor (por exemplo, `expo-document-picker`) em `onPick` e passa a lista em `files`.
- **Select, Combobox, DatePicker e DateRangePicker:** usam o `Modal` nativo. A lista do Select e do Combobox fica ancorada no gatilho; o calendário abre centralizado.
- **Toast:** envolva o app em `ToastProvider` e use `useToast()`. A pilha aparece acima do conteúdo, mas abaixo de qualquer overlay que usa o `Modal` nativo (Modal, Drawer, Popover, Menu, Tooltip, Select, Combobox e os seletores de data). A `action` do toast continua usando `onClick`, como na web.
- **Grid, Container e Table:** feitos com flexbox, sem CSS grid. O `Grid` define as colunas pela largura da janela, e o `Container` escolhe a margem lateral pela largura da janela (768). Na `Table`, colunas com largura fixa dependem de `className` nas células.
- **Slider:** reimplementado sem Radix; `value` e `defaultValue` são `number[]` e há `onValueCommit`.
- **Popover, Menu e Tooltip:** só abrem para cima ou para baixo (sem `align`, `left` e `right`), e o Tooltip não tem `delayDuration` nem seta. O texto do `content` do Tooltip também vira `accessibilityHint` do gatilho.
- **Tabs:** sem `orientation` e sem navegação por teclado; a `TabList` rola na horizontal.
- **Drawer:** sem `size` e sem `showClose` (o botão de fechar aparece sempre); o Modal mantém os dois.
- **Accordion:** anima só o layout (`LayoutAnimation`).

## Limitações atuais

- Sem blur no fundo de Modal e Drawer.
- `shadow-*` não gera `elevation` no Android, então Card, Popover e similares podem ficar sem sombra lá.
- O overlay ancorado (Popover, Menu, Select, Combobox) não considera o teclado.
- O `paddingTop` do Toast é estimado, não a área segura real.
- Skeleton, Spinner, Switch e Accordion não respeitam "reduzir movimento".
