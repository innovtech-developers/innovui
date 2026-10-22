---
name: innovui-react-native
description: Usa o InnovUI (@innovui/react-native), o design system da Comhub para apps mobile, em Expo ou React Native puro. Use ao criar ou alterar telas com os componentes do InnovUI (Button, Input, Select, Modal, Toast...), ao instalar e configurar o pacote (Metro, Uniwind, global.css) ou ao personalizar tema e modo escuro. Use when building mobile UI with @innovui/react-native.
---

# InnovUI para React Native

Biblioteca de componentes React Native tipados (`@innovui/react-native`), estilizados com [Uniwind](https://docs.uniwind.dev) (Tailwind v4), com tema claro e escuro.
Documentação: https://innovui.innovtechsolutions.com.br/react-native/instalacao/

## Antes de escrever código

1. Confirme a instalação: `@innovui/react-native`, `uniwind`, `tailwindcss` e `react-native-svg` no `package.json`. Requer React 19, React Native 0.81 ou mais recente, Tailwind v4 e Metro. Se faltar configuração (Metro, `global.css`), siga o passo a passo: https://innovui.innovtechsolutions.com.br/react-native/instalacao/
2. O `global.css` deve ter `@import 'tailwindcss'; @import 'uniwind'; @import '@innovui/react-native/theme.css';` e um `@source` apontando para `node_modules/@innovui/react-native/dist`. Ele é importado **uma vez**, no componente raiz (`App.tsx` ou `app/_layout.tsx`), **nunca** no `index.js`.
3. Antes de usar um componente, leia a página dele para conferir as props:
   `https://innovui.innovtechsolutions.com.br/react-native/components/<nome-em-minusculas>/`
   Para ler toda a doc do React Native de uma vez: https://innovui.innovtechsolutions.com.br/_llms-txt/react-native.txt

## Regras

- Importe tudo de `@innovui/react-native`: `import { Button, Field, Input } from '@innovui/react-native'`.
- Esta é a API do React Native, não a da web: toque é `onPress` (não `onClick`), texto digitado é `onChangeText`, marcar e desmarcar é `onCheckedChange(boolean)`, e a acessibilidade usa `accessibilityLabel`, `accessibilityState` e `accessibilityHint` (não `aria-*`). Não existem `asChild`, hover nem foco por teclado.
- O texto não herda cor nem tamanho no React Native. Vários componentes aceitam só `string` como filho (Badge, Tag, Button, `title` do Alert e do Toast, `MenuItem`). Quando aceitam outros nós, estilize o `Text` (ex.: `className="text-text-primary"`).
- Gatilhos de Modal, Drawer, Popover e Menu recebem `onPress` por clonagem: precisam ser um elemento que aceite essa prop (como o `Button`). O Tooltip abre com toque longo.
- Ícones SVG não herdam a cor: passe `color`, lendo o token com `useCSSVariable('--color-...')`, do Uniwind.
- Estilize com `className` (Uniwind): ele é mesclado com as classes internas (`tailwind-merge`) e a sua vence. Os tokens viram utilitários (`--color-bg-primary` vira `bg-bg-primary`). Para mudar um token, sobrescreva a variável no `global.css` depois do import do `theme.css`, nos dois temas; nunca use um hex direto.
- Modo escuro: `Uniwind.setTheme('light' | 'dark' | 'system')`; `useUniwind()` lê o tema atual. Os componentes não têm variante "dark".
- Notificações: envolva o app em `ToastProvider` e use `useToast()`.
- Listas longas: `List` e `Table` não rolam nem virtualizam; use `FlatList` ou `Pagination`.
- Se `className` der erro de tipo, rode o Metro uma vez para gerar o `uniwind-types.d.ts` e inclua o arquivo no `tsconfig.json`.

## Componentes por categoria

- **Ações:** Button, IconButton, Link
- **Formulários:** Field, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, DatePicker, DateRangePicker, Calendar, Upload
- **Exibição de dados:** Avatar, Badge, Tag, Card, List, Table, Accordion
- **Feedback:** Alert, Banner, Toast, Skeleton, Spinner
- **Navegação:** Tabs, SegmentedControl, Breadcrumb, Pagination, Stepper
- **Sobreposições:** Modal, Drawer, Popover, Menu, Tooltip
- **Layout:** Container, Grid, Stack, Divider
- **Mídia:** AudioPlayer, VideoPlayer, Gallery, Lightbox, Carousel

Se a necessidade não está na lista, use `View`, `Text` e Uniwind normais em vez de inventar um componente do InnovUI.
