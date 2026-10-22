# @innovui/react-native

## 0.3.1

### Patch Changes

- [#27](https://github.com/innovtech-developers/innovui/pull/27) [`d2ef1ce`](https://github.com/innovtech-developers/innovui/commit/d2ef1ceba22d648d24cd79405ca62611f59ce726) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - AudioPlayer: em cartões estreitos (menos de 26rem, ou 416px) o tempo desce para baixo da onda, que ganha a largura toda e mostra mais barras. Em cartões largos o layout do Figma não muda.

- [#25](https://github.com/innovtech-developers/innovui/pull/25) [`47ad224`](https://github.com/innovtech-developers/innovui/commit/47ad224cf924738aecc9198c2bbf5955744f1054) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Corrige os players de mídia no celular.
  
  - **AudioPlayer (React e React Native):** em telas estreitas a onda passava por cima do tempo e do botão de velocidade. Agora ela mede a largura e desenha só as barras que cabem (no mínimo 2px, com 2px de espaço), nunca mais que `bars`.
  - **VideoPlayer (React):** em vídeos pequenos a faixa de controles cobria o play central e engolia o toque, então o vídeo não tocava. A faixa deixa o toque passar; só a barra de posição e os botões o recebem.

## 0.3.0

### Minor Changes

- [#23](https://github.com/innovtech-developers/innovui/pull/23) [`58530bf`](https://github.com/innovtech-developers/innovui/commit/58530bfe325c8b59f500779f9f511485a68d42a4) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Novos componentes de mídia: `AudioPlayer`, `VideoPlayer`, `Gallery`, `Lightbox` e `Carousel`, conforme o Figma "Componentes de mídia".
  
  - **React:** `AudioPlayer` só precisa do `src` (a onda é extraída do próprio áudio, com `waveform` como alternativa e uma onda padrão se a análise falhar); `VideoPlayer` com controles próprios (play central, posição, tempo, volume, tela cheia); `Gallery` e `Lightbox` (setas, contador, `Esc`); `Carousel` com encaixe, arrasto, pontos e setas.
  - **React Native:** `Gallery`, `Lightbox` e `Carousel` completos. `AudioPlayer` e `VideoPlayer` são cascas controladas (`playing`, `position`, `duration`, `onPlayPause`, `onSeek`…) para ligar ao `expo-audio` e ao `expo-video`; a onda vem de `waveform` ou da onda padrão.
  - Tokens novos de mídia: `--color-media-wave-rest`, `--color-media-surface`, `--color-media-on-surface` e `--color-media-accent`.

## 0.2.0

### Minor Changes

- [#20](https://github.com/innovtech-developers/innovui/pull/20) [`bffd808`](https://github.com/innovtech-developers/innovui/commit/bffd80848fc43af05e58fb2cc028ac9cc1b7c1ae) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Paridade com o `@innovui/react`. Drawer: arrastar o painel para a borda fecha (`swipeToClose`, ligado por padrão), com o backdrop clareando junto e a rolagem do corpo respeitada, e uma barrinha de arraste nos painéis `top` e `bottom` (`showHandle`). Tabs e SegmentedControl: o sublinhado e o pill viram um indicador único que desliza e se redimensiona até o item ativo (pula direto com "Reduzir movimento"). Toast: arrastar para o lado dispensa (e pausa o auto-fechar enquanto o dedo segura), e os toasts de baixo deslizam para o lugar quando um sai. Modal entra com fade e zoom de 95%, e Popover, Menu, Tooltip, Select, Combobox e DatePicker com fade e zoom de 96% a partir do gatilho (antes só faziam fade). Tooltip: `showArrow` (seta, ligada por padrão), balão centrado no gatilho e `delayDuration`. Drawer, Modal e os overlays ancorados respeitam "Reduzir movimento".

### Patch Changes

- [#20](https://github.com/innovtech-developers/innovui/pull/20) [`d730720`](https://github.com/innovtech-developers/innovui/commit/d730720a126aa48ed0c0f8df4da722269a8a3eb5) Thanks [@lucas-bogos](https://github.com/lucas-bogos)! - Input: um `Pressable` em `leadingIcon` ou `trailingIcon` volta a receber o toque (o slot do ícone tinha `pointerEvents="none"`, que bloqueava o ícone interativo, como o de mostrar/ocultar senha). O slot agora é `box-none`; um ícone que não trata o toque continua focando o campo.

## 0.1.0

### Minor Changes

- [#11](https://github.com/innovtech-developers/innovui/pull/11) [`403f626`](https://github.com/innovtech-developers/innovui/commit/403f626961e1b00152176f979b18bcc8255d4ad9) Thanks [@rafael-bogos](https://github.com/rafael-bogos)! - Novo pacote `@innovui/react-native`, estilizado com Uniwind: tokens do design system (claro e escuro, gerados do `tokens.css`) em `theme.css`, os mesmos componentes do `@innovui/react`, adaptados ao React Native.
