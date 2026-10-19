# @innovui/react

## 0.4.0

### Minor Changes

- [`38cea69`](https://github.com/innovtech-developers/innovui/commit/38cea6963ebdce3b071964e8583d144a95199fa2) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona Tooltip (4 posições, seta e título opcional) e Modal (+ `ModalClose`, com backdrop, foco preso e `Esc`) — fecha a Fase 3 (Navegação e Overlay), construídos sobre o Radix UI Tooltip e Dialog, com tokens extraídos do Figma.

- [`535707d`](https://github.com/innovtech-developers/innovui/commit/535707d13ab69591807a7e324c25d595a8309ffd) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona o modo escuro. Os mesmos tokens semânticos e de componente passam a resolver para os valores do modo Dark do design system quando há `class="dark"` ou `data-theme="dark"` no `<html>` (ou em qualquer elemento): nenhum componente muda. O fundo do Modal fica mais opaco no escuro (`--surface-overlay-opacity`: 50% → 70%). A ativação não é automática por `prefers-color-scheme`; veja "Tema e customização" na documentação.

- [`67c3dbf`](https://github.com/innovtech-developers/innovui/commit/67c3dbf079883e79fd1fdde753dd7011450a2918) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona Tabs (`Tabs`, `TabList`, `Tab`, `TabPanel`) e SegmentedControl (`SegmentedControl` + `SegmentedItem`) — início da Fase 3 (Navegação), construídos sobre o Radix UI Tabs e Radio Group, com navegação por teclado e tokens extraídos do Figma.

- [`aa9032b`](https://github.com/innovtech-developers/innovui/commit/aa9032b988b48397fd7f4a029f8ec6928c5731ce) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona Stepper (`Stepper` + `Step`, com o estado de cada passo derivado de `current`) e Breadcrumb (`Breadcrumb` + `BreadcrumbItem`, com `asChild` para links de roteador) — continuação da Fase 3 (Navegação), com tokens extraídos do Figma e acessibilidade (`aria-current`).

### Patch Changes

- [`5d07c0a`](https://github.com/innovtech-developers/innovui/commit/5d07c0ad216d193ff14f4e2be53986e96cce72c8) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Corrige o `Stepper` em Server Components: o arquivo usava `createContext` sem `'use client'`, o que quebrava o `next build` de quem importava o componente numa página de servidor.

## 0.3.0

### Minor Changes

- [`19fc07f`](https://github.com/innovtech-developers/innovui/commit/19fc07f9144267ea362504fd377ceae274058c7e) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona Alert (mensagem em bloco com título, ação e fechar) e Banner (mensagem em largura total) — 5 status cada, com ícones semânticos e tokens extraídos do Figma.

- [`ad5105a`](https://github.com/innovtech-developers/innovui/commit/ad5105ac8ff2a70f97fa4782a77b50278da40af6) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona Badge (6 status, com indicador opcional) e Tag (filled/outline, removível) — início da Fase 2 (Feedback), com tokens extraídos do Figma e cobertura de testes/acessibilidade.

- [`f13c4dd`](https://github.com/innovtech-developers/innovui/commit/f13c4dd2346c5c0f949141fe0b30438d1e169885) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona o Skeleton (text, title, avatar, card e rectangle, com pulse) — fecha a Fase 2 (Feedback e Loading).

- [`3c83423`](https://github.com/innovtech-developers/innovui/commit/3c83423e564313f1790cf7af9651b0c3e1b90651) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona o Toast: `ToastProvider` + hook `useToast()` para disparar notificações temporárias de qualquer lugar (5 status, ação, fechar, auto-dismiss de 5s com pausa ao passar o mouse, região acessível), construído sobre o Radix UI Toast.

## 0.2.0

### Minor Changes

- [`4f2a7f0`](https://github.com/innovtech-developers/innovui/commit/4f2a7f0715ed89e8fdf9d3335b0a0b627f718c44) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona o componente `IconButton` — versão quadrada do Button, só com ícone, com os mesmos estilos, estados e tokens e `aria-label` obrigatório.

## 0.1.0

### Minor Changes

- [`38d5057`](https://github.com/innovtech-developers/innovui/commit/38d5057fcdc3470189b28a50cd26a33ecc9a9cd3) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona o componente `Select` (`Select` + `SelectOption`) — escolha única via dropdown, construído sobre o Radix UI Select, com tamanhos/estados e tokens extraídos do Figma e cobertura de testes/acessibilidade.

- [`67f59ca`](https://github.com/innovtech-developers/innovui/commit/67f59ca622532b44c34a3e58412014d9e352427f) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona Input, Field, Textarea, Checkbox, Radio e Switch — o resto da Fase 1 (Form Controls) do design system, com tokens e geometria extraídos do Figma e cobertura de testes/acessibilidade.

- [`3efb36f`](https://github.com/innovtech-developers/innovui/commit/3efb36f18a6c2513f80bf4b97884f674f24d7b8d) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Adiciona os componentes `Button` e `Spinner`, os design tokens do Comhub Design System (modo claro) e o pipeline de build (ESM + `.d.ts` + `styles.css`).
