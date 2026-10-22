---
name: innovui-react
description: Usa o InnovUI (@innovui/react), o design system React da Comhub, para montar interfaces web. Use ao criar ou alterar telas em React, Next.js ou Vite com os componentes do InnovUI (Button, Input, Select, Modal, Toast, Table...), ao instalar e configurar o pacote, ou ao personalizar tema e modo escuro. Use when building web UI with @innovui/react.
---

# InnovUI para React (web)

Biblioteca de componentes React tipados e acessíveis (`@innovui/react`), com tema claro e escuro.
Documentação: https://innovui.innovtechsolutions.com.br/react/instalacao/

## Antes de escrever código

1. Confirme que o pacote está instalado (`@innovui/react` no `package.json`). Se não estiver: `pnpm add @innovui/react` (ou `npm install` / `bun add`). Requer React 19 ou mais recente.
2. Confirme que o CSS é importado **uma vez**, no ponto de entrada: `import '@innovui/react/styles.css'` (`app/layout.tsx` no Next.js, `main.tsx` no Vite).
3. Antes de usar um componente, leia a página dele para conferir as props, em vez de adivinhar:
   `https://innovui.innovtechsolutions.com.br/react/components/<nome-em-minusculas>/` (ex.: `.../react/components/select/`, `date-range-picker`, `icon-button`).
   Para ler toda a doc do React de uma vez: https://innovui.innovtechsolutions.com.br/_llms-txt/react.txt

## Regras

- Importe tudo de `@innovui/react`: `import { Button, Field, Input } from '@innovui/react'`. Subcomponentes também (`AccordionItem`, `ModalClose`, `MenuItem`, `TableRow`...).
- Os componentes interativos já têm `"use client"`: funcionam em Server Components do Next.js sem diretiva extra no seu código.
- Estilize com `className`: ele é mesclado com as classes internas (`tailwind-merge`) e a sua vence. As classes internas usam o prefixo `iu:`, então não colidem com o Tailwind do projeto. Não é preciso ter Tailwind instalado.
- Com Tailwind v4 no projeto, importe o CSS da lib **antes** do Tailwind: `@import "@innovui/react/styles.css"; @import "tailwindcss";`.
- Cor vem de tokens (variáveis CSS como `--color-button-primary-bg`). Para mudar, sobrescreva a variável depois do import do CSS da lib; **nunca** aplique um hex direto no componente.
- Modo escuro: `class="dark"` ou `data-theme="dark"` no `<html>`. Os componentes não têm variante "dark" e o InnovUI não segue `prefers-color-scheme` sozinho. Modal, Toast, Tooltip e Select renderizam no `<body>`, então a classe precisa estar no `<html>` ou no `<body>`.
- Campo de formulário: use `Field` (rótulo + controle + ajuda/erro) em vez de montar o rótulo à mão.
- Ícone-só: `IconButton` exige nome acessível (`aria-label`).
- Notificações: envolva o app em `ToastProvider` e dispare com `useToast()`.
- Acessibilidade já vem nos componentes (teclado, foco, ARIA). Não a remova; se o botão não tem texto, dê `aria-label`.

## Componentes por categoria

- **Ações:** Button, IconButton, Link
- **Formulários:** Field, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, DatePicker, DateRangePicker, Calendar, Upload
- **Exibição de dados:** Avatar, Badge, Tag, Card, List, Table, Accordion
- **Feedback:** Alert, Banner, Toast, Skeleton, Spinner (este ainda sem página na doc)
- **Navegação:** Tabs, SegmentedControl, Breadcrumb, Pagination, Stepper
- **Sobreposições:** Modal, Drawer, Popover, Menu, Tooltip
- **Layout:** Container, Grid, Stack, Divider
- **Mídia:** AudioPlayer, VideoPlayer, Gallery, Lightbox, Carousel

Se a necessidade não está na lista, use HTML e Tailwind normais em vez de inventar um componente do InnovUI.
