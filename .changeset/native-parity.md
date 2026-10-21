---
'@innovui/react-native': minor
---

Paridade com o `@innovui/react`. Drawer: arrastar o painel para a borda fecha (`swipeToClose`, ligado por padrão), com o backdrop clareando junto e a rolagem do corpo respeitada, e uma barrinha de arraste nos painéis `top` e `bottom` (`showHandle`). Tabs e SegmentedControl: o sublinhado e o pill viram um indicador único que desliza e se redimensiona até o item ativo (pula direto com "Reduzir movimento"). Toast: arrastar para o lado dispensa (e pausa o auto-fechar enquanto o dedo segura), e os toasts de baixo deslizam para o lugar quando um sai. Modal entra com fade e zoom de 95%, e Popover, Menu, Tooltip, Select, Combobox e DatePicker com fade e zoom de 96% a partir do gatilho (antes só faziam fade). Tooltip: `showArrow` (seta, ligada por padrão), balão centrado no gatilho e `delayDuration`. Drawer, Modal e os overlays ancorados respeitam "Reduzir movimento".
