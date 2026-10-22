# @innovui/react

## 1.1.1

### Patch Changes

- [#27](https://github.com/innovtech-developers/innovui/pull/27) [`d2ef1ce`](https://github.com/innovtech-developers/innovui/commit/d2ef1ceba22d648d24cd79405ca62611f59ce726) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - AudioPlayer: em cartões estreitos (menos de 26rem, ou 416px) o tempo desce para baixo da onda, que ganha a largura toda e mostra mais barras. Em cartões largos o layout do Figma não muda.

- [#25](https://github.com/innovtech-developers/innovui/pull/25) [`47ad224`](https://github.com/innovtech-developers/innovui/commit/47ad224cf924738aecc9198c2bbf5955744f1054) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Corrige os players de mídia no celular.
  
  - **AudioPlayer (React e React Native):** em telas estreitas a onda passava por cima do tempo e do botão de velocidade. Agora ela mede a largura e desenha só as barras que cabem (no mínimo 2px, com 2px de espaço), nunca mais que `bars`.
  - **VideoPlayer (React):** em vídeos pequenos a faixa de controles cobria o play central e engolia o toque, então o vídeo não tocava. A faixa deixa o toque passar; só a barra de posição e os botões o recebem.

## 1.1.0

### Minor Changes

- [#23](https://github.com/innovtech-developers/innovui/pull/23) [`58530bf`](https://github.com/innovtech-developers/innovui/commit/58530bfe325c8b59f500779f9f511485a68d42a4) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Novos componentes de mídia: `AudioPlayer`, `VideoPlayer`, `Gallery`, `Lightbox` e `Carousel`, conforme o Figma "Componentes de mídia".
  
  - **React:** `AudioPlayer` só precisa do `src` (a onda é extraída do próprio áudio, com `waveform` como alternativa e uma onda padrão se a análise falhar); `VideoPlayer` com controles próprios (play central, posição, tempo, volume, tela cheia); `Gallery` e `Lightbox` (setas, contador, `Esc`); `Carousel` com encaixe, arrasto, pontos e setas.
  - **React Native:** `Gallery`, `Lightbox` e `Carousel` completos. `AudioPlayer` e `VideoPlayer` são cascas controladas (`playing`, `position`, `duration`, `onPlayPause`, `onSeek`…) para ligar ao `expo-audio` e ao `expo-video`; a onda vem de `waveform` ou da onda padrão.
  - Tokens novos de mídia: `--color-media-wave-rest`, `--color-media-surface`, `--color-media-on-surface` e `--color-media-accent`.

## 1.0.0

### Major Changes

- [#18](https://github.com/innovtech-developers/innovui/pull/18) [`662326c`](https://github.com/innovtech-developers/innovui/commit/662326ca1e7bf85552749db1fb0877b3177bba62) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Primeira versão estável. O design system do Figma está completo (ações, formulários, feedback, navegação e sobreposições) e mais as peças derivadas dele (Card, Avatar, Stack, Table, Combobox, DatePicker e outras), com modo claro e escuro, animações de entrada e saída que respeitam `prefers-reduced-motion`, e README e metadados do pacote. A partir daqui, mudanças que quebram a API só entram em uma nova versão major.

## 0.8.0

### Minor Changes

- [#16](https://github.com/innovtech-developers/innovui/pull/16) [`1cd0c65`](https://github.com/innovtech-developers/innovui/commit/1cd0c652228dc9b058a49739fe7b637cdf9a701f) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Arrastar para fechar o Drawer: o backdrop clareia junto com o painel; quando o gesto começa rolando o conteúdo e este chega ao começo, o painel assume o resto do arraste (e devolve a rolagem se o dedo recuar); e corrigido um salto ao soltar antes do limite, em que a animação de entrada do painel reiniciava durante a volta. Novo `showHandle` (padrão `true`): barrinha de arraste do Figma (40px) nos painéis `top` e `bottom`.

## 0.7.0

### Minor Changes

- [#14](https://github.com/innovtech-developers/innovui/pull/14) [`d7abfa8`](https://github.com/innovtech-developers/innovui/commit/d7abfa8061029f1d82fae89e599b49832db205da) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Modal, Drawer, Toast, Popover, Menu, Tooltip, Select, Combobox, DatePicker e DateRangePicker passam a animar a entrada e a saída: backdrop com fade, Modal com fade e zoom, Drawer deslizando do lado do `side`, Toast entrando pela direita (e saindo na direção do swipe) e as listas flutuantes com fade e zoom a partir do gatilho. Tudo é desligado com `prefers-reduced-motion`. O Toast fechado continua montado até a animação de saída terminar.
  
  Também: o sublinhado das Tabs e o fundo do item marcado do SegmentedControl passam a ser um indicador único que desliza até o item ativo, o conteúdo do Accordion anima a altura ao abrir e fechar, o Drawer fecha arrastando para a borda no celular (`swipeToClose`, ligado por padrão), os Toasts de baixo deslizam para o lugar quando um fecha (em vez de pular), e Tab, SegmentedItem e o gatilho do Accordion ganham `transition-colors` no hover.

## 0.6.1

### Patch Changes

- [#9](https://github.com/innovtech-developers/innovui/pull/9) [`98f374b`](https://github.com/innovtech-developers/innovui/commit/98f374bb1d0a24f2160c675871a48c1103238fda) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - O foco de Input, Textarea, Select, Upload (e, por eles, Combobox, DatePicker e DateRangePicker) passa a ser uma linha só de 2px por dentro, na cor do anel, como no Figma, em vez de borda cinza mais anel por fora. A linha cinza ficou bem visível no modo escuro depois que `border/strong` clareou.

## 0.6.0

### Minor Changes

- [#7](https://github.com/innovtech-developers/innovui/pull/7) [`cc9b30f`](https://github.com/innovtech-developers/innovui/commit/cc9b30f30ee733500caa1a8b44b7392c02345fab) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Ajustes confirmados pelo designer: o Toast passa a aparecer no canto superior direito e sua ação é um Button ghost médio (44px), como as ações de Alert e Banner nas docs; o item ativo do SegmentedControl ganha fundo de superfície (branco no claro) com sombra e o texto dos inativos escurece no hover; no modo escuro, `border/default` sobe para gray/500 e `border/strong` para gray/400 (e os tokens de campo, seleção e status neutro que os usam), para as bordas não sumirem contra a superfície. O backdrop do Modal e do Drawer ganha blur de 16px. Novo token `--color-surface-primary`.

## 0.5.0

### Minor Changes

- [#5](https://github.com/innovtech-developers/innovui/pull/5) [`f906113`](https://github.com/innovtech-developers/innovui/commit/f90611312735439ccf2e88f78ece8fdbc9da50c2) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Fase 4: novos componentes Card, Avatar, Divider, Link, Stack, Popover, Menu, Drawer, Accordion, Container, Grid, List, Table, Pagination, Combobox, Slider, Upload, Calendar, DatePicker e DateRangePicker (período, com atalhos como "Últimos 7 dias").

- [`01c9bbd`](https://github.com/innovtech-developers/innovui/commit/01c9bbdab1f91a4b434fd8b882c133e186886c5d) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Toast ganha `showIcon` e `dismissible`; Modal ganha `showHeaderDivider` e `showFooterDivider`, as opções que o Figma já tinha e a API não expunha.

### Patch Changes

- [`6cb8d33`](https://github.com/innovtech-developers/innovui/commit/6cb8d337142d84868fb9e8713e6b2217b8813675) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Ajusta o contraste de 13 cores (2 no claro, 11 no escuro) para que todo par de texto do design system chegue a 4,5:1: texto de sucesso no claro; `text/secondary`, `text/brand`, erro, info, primário e destrutivo no escuro (com a escada de hover e active dos botões). Os valores seguem as sugestões do designer e divergem temporariamente das variáveis do Figma. Um teste de contraste passa a proteger os pares nos dois modos.

- [`5d01535`](https://github.com/innovtech-developers/innovui/commit/5d015359d75f08e612ec8ebd9a272032a99b601e) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Ajusta a geometria ao Figma: Button (padding md 24 e sm 16, texto do sm em 14px, peso semibold, gap 4 no sm, ghost com estado ativo e sem fundo cinza quando desabilitado), Input (padding md 12 e sm 8, recuo do texto e tamanho do ícone por tamanho), Textarea (padding por tamanho), Field (gap 4, texto de apoio 12px, ícone de erro, props `size` e `readOnly`) e Tag outline (20px de altura).

- [`afdc81b`](https://github.com/innovtech-developers/innovui/commit/afdc81b0c07b3b8449a82e684440fab4a03f397b) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Ajusta estados ao Figma: Radio selecionado com o círculo preenchido, erro visível também em Checkbox e Radio marcados, labels em peso medium com área de toque de 44px, texto desabilitado pelos tokens (sem `opacity`), Switch desabilitado sem hover e sem sombra no knob, e Input, Textarea e Select somente leitura sem borda.

- [`918b859`](https://github.com/innovtech-developers/innovui/commit/918b8593fdd5a32eb1e2f62c70c20c261c75d639) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - O foco do Button e do IconButton passa a ser um anel de 2px por dentro da borda, e Checkbox, Radio e Switch perdem o `ring-offset`, como no Figma.

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
