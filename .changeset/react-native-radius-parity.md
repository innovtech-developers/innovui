---
'@innovui/react-native': patch
---

Raios de borda iguais aos do web e do design system. `rounded-md` e `rounded-lg` vinham do Tailwind (6px e 8px), e o design system usa 8px e 12px. Afetava Input, Textarea, Select, Combobox, Card, Alert, Modal, Drawer, Toast, Popover, Menu, Upload, VideoPlayer e outros. Os componentes passam a usar 8px e 12px direto, sem mudar o `rounded-*` do app consumidor.
