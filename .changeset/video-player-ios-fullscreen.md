---
'@innovui/react-native': patch
---

VideoPlayer: em tela cheia no iOS os controles do sistema (play, barra e tempo) agora ligam sozinhos. O `VideoPlayer` liga o `nativeControls` do `VideoView` (filho direto, com a prop `nativeControls`) antes de chamar `onToggleFullscreen`, então não é preciso mais controlar isso no app. Mantenha `fullscreen` ligado a `onFullscreenEnter` e `onFullscreenExit`.
