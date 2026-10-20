---
'@innovui/react': minor
---

Modal, Drawer, Toast, Popover, Menu, Tooltip, Select, Combobox, DatePicker e DateRangePicker passam a animar a entrada e a saída: backdrop com fade, Modal com fade e zoom, Drawer deslizando do lado do `side`, Toast entrando pela direita (e saindo na direção do swipe) e as listas flutuantes com fade e zoom a partir do gatilho. Tudo é desligado com `prefers-reduced-motion`. O Toast fechado continua montado até a animação de saída terminar.

Também: o sublinhado das Tabs e o fundo do item marcado do SegmentedControl passam a ser um indicador único que desliza até o item ativo, o conteúdo do Accordion anima a altura ao abrir e fechar, o Drawer fecha arrastando para a borda no celular (`swipeToClose`, ligado por padrão), os Toasts de baixo deslizam para o lugar quando um fecha (em vez de pular), e Tab, SegmentedItem e o gatilho do Accordion ganham `transition-colors` no hover.
