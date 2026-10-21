---
'@innovui/react-native': patch
---

Input: um `Pressable` em `leadingIcon` ou `trailingIcon` volta a receber o toque (o slot do ícone tinha `pointerEvents="none"`, que bloqueava o ícone interativo, como o de mostrar/ocultar senha). O slot agora é `box-none`; um ícone que não trata o toque continua focando o campo.
