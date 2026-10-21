---
title: Convenções
description: Como as props, os gatilhos, o texto e os ícones funcionam nos componentes do @innovui/react-native.
---

Os componentes seguem as convenções do React Native: toque em vez de clique, props de acessibilidade nativas e estilos por `className` (Uniwind).

## Props e eventos

| Para | Use |
|---|---|
| Tocar | `onPress` |
| Texto digitado (Input, Textarea) | `onChangeText` |
| Marcar e desmarcar (Checkbox, Radio, Switch) | `onCheckedChange(boolean)` |
| Acessibilidade | `accessibilityLabel`, `accessibilityState`, `accessibilityHint`... |
| Abrir um endereço (Link) | `href`, aberto com `Linking.openURL` |
| Feedback de toque | o estado `active:` do Uniwind |

Não há hover nem foco por teclado: o toque é a única interação.

## Gatilhos (Modal, Drawer, Popover, Menu, Tooltip)

O gatilho é um elemento React que recebe `onPress` por clonagem, então precisa aceitar essa prop (como o `Button`). O `Tooltip` abre com toque longo (`onLongPress`).

```tsx
<Popover label="Detalhes" trigger={<Button variant="tertiary">Abrir</Button>}>
  <Text>Conteúdo</Text>
</Popover>
```

## Texto

No React Native o texto não herda cor nem tamanho do pai. Por isso, alguns componentes aceitam apenas `string`: Badge, Tag, `title` do Alert, `title` e `description` do Toast, e `MenuItem` e `MenuLabel`. Quando o componente aceita outros nós, você estiliza o `Text` por conta própria (por exemplo, `text-text-primary`).

## Ícones

Ícones SVG recebem a cor por uma prop `color`. Para usar um token, leia o valor com `useCSSVariable`, do Uniwind.

```tsx
import { useCSSVariable } from 'uniwind'

const color = useCSSVariable('--color-button-primary-text') as string

<Button leadingIcon={<PlusIcon color={color} />}>Adicionar</Button>
```

## Componentes com comportamento próprio

- **Upload:** o componente é controlado. Você abre o seletor (por exemplo, `expo-document-picker`) em `onPick` e passa a lista em `files`.
- **Select, Combobox, DatePicker e DateRangePicker:** usam o `Modal` nativo. A lista do Select e do Combobox fica ancorada no gatilho; o calendário abre centralizado.
- **Toast:** envolva o app em `ToastProvider` e use `useToast()`. A pilha aparece acima do conteúdo, mas abaixo de qualquer overlay que usa o `Modal` nativo (Modal, Drawer, Popover, Menu, Tooltip, Select, Combobox e os seletores de data).
- **Grid, Container e Table:** feitos com flexbox. O `Grid` define as colunas pela largura da janela, e o `Container` escolhe a margem lateral pela largura da janela (768). Na `Table`, colunas com largura fixa dependem de `className` nas células.
- **Slider:** `value` e `defaultValue` são `number[]` e há `onValueCommit`.
- **Popover, Menu e Tooltip:** só abrem para cima ou para baixo, e o texto do `content` do Tooltip também vira `accessibilityHint` do gatilho.
- **Tabs:** a `TabList` rola na horizontal e a troca é por toque.
- **Accordion:** anima só o layout (`LayoutAnimation`).

## Limitações atuais

- Sem blur no fundo de Modal e Drawer.
- `shadow-*` não gera `elevation` no Android, então Card, Popover e similares podem ficar sem sombra lá.
- O overlay ancorado (Popover, Menu, Select, Combobox) não considera o teclado.
- O `paddingTop` do Toast é estimado, não a área segura real.
- Skeleton, Spinner, Switch e Accordion não respeitam "Reduzir movimento".
