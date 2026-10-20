# @innovui/react

Componentes React do design system InnovUI, da Comhub: tipagem completa em TypeScript, acessíveis por padrão e com modo claro e escuro. Mais de 40 componentes, do `Button` ao `DateRangePicker`.

📚 **Documentação, exemplos e props de cada componente:** [innovui.innovtechsolutions.com.br](https://innovui.innovtechsolutions.com.br)

Para apps mobile, existe o [`@innovui/react-native`](https://www.npmjs.com/package/@innovui/react-native), com os mesmos componentes.

## Instalação

```bash
pnpm add @innovui/react
# ou: npm install @innovui/react / bun add @innovui/react
```

Importe o CSS da lib uma vez, no ponto de entrada do app (`app/layout.tsx` no Next.js, `main.tsx` no Vite):

```tsx
import '@innovui/react/styles.css'
```

E use os componentes:

```tsx
import { Button } from '@innovui/react'

export function Example() {
  return <Button>Salvar alterações</Button>
}
```

**Requisitos:** React 19 ou mais recente (`react` e `react-dom` como peer dependencies). Não é preciso ter Tailwind instalado: o CSS já vem compilado.

## O que vem na caixa

- **Ações:** Button, IconButton, Link
- **Formulários:** Input, Textarea, Field, Select, Combobox, Checkbox, Radio, Switch, Slider, Upload, DatePicker, DateRangePicker, Calendar
- **Feedback:** Alert, Banner, Toast, Badge, Tag, Skeleton, Spinner
- **Navegação:** Tabs, SegmentedControl, Stepper, Breadcrumb, Pagination
- **Sobreposições:** Modal, Drawer, Popover, Menu, Tooltip
- **Layout e dados:** Card, Avatar, Divider, Stack, Container, Grid, List, Table, Accordion

## Modo escuro

Os componentes não têm variante "dark": cada token resolve para o seu valor do modo escuro. Para ativar, ponha `class="dark"` ou `data-theme="dark"` no `<html>` (ou em qualquer elemento: o tema vale para tudo que está dentro dele). Não ativa sozinho com `prefers-color-scheme`; é uma escolha sua.

## Convive com o seu projeto

- **Tailwind v4:** as classes da lib têm o prefixo `iu:` e os tokens do tema dela viram `--iu-*`, então o `@theme` do seu projeto não altera os componentes. Importe o CSS da lib antes do Tailwind:

  ```css
  @import "@innovui/react/styles.css";
  @import "tailwindcss";
  ```

- **Server Components (Next.js, App Router):** os componentes que precisam de estado já trazem `"use client"`; os demais rodam no servidor.
- **`className`:** todo componente aceita `className`, mesclado com `tailwind-merge`. Quando a sua classe conflita com a da lib, vale a ordem de import do CSS (lib antes do Tailwind: a sua vence).

## Acessibilidade e movimento

Os componentes seguem os padrões WAI-ARIA (a base de overlays, abas e seleção é o [Radix UI](https://www.radix-ui.com)) e são testados com o axe. As animações de entrada e saída são desligadas com `prefers-reduced-motion`.

## Versionamento

[Semver](https://semver.org/lang/pt-BR/). A partir da 1.0, mudanças que quebram a API só entram em uma nova versão major, e cada versão tem as suas notas no [CHANGELOG](./CHANGELOG.md).

## Contribuindo

O código está em [innovtech-developers/innovui](https://github.com/innovtech-developers/innovui) (monorepo). Veja o [guia de contribuição](https://github.com/innovtech-developers/innovui/blob/main/CONTRIBUTING.md) e abra [issues](https://github.com/innovtech-developers/innovui/issues) para bugs e sugestões.

## Licença

[MIT](https://github.com/innovtech-developers/innovui/blob/main/LICENSE)
