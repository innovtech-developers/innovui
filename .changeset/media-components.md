---
'@innovui/react': minor
'@innovui/react-native': minor
---

Novos componentes de mídia: `AudioPlayer`, `VideoPlayer`, `Gallery`, `Lightbox` e `Carousel`, conforme o Figma "Componentes de mídia".

- **React:** `AudioPlayer` só precisa do `src` (a onda é extraída do próprio áudio, com `waveform` como alternativa e uma onda padrão se a análise falhar); `VideoPlayer` com controles próprios (play central, posição, tempo, volume, tela cheia); `Gallery` e `Lightbox` (setas, contador, `Esc`); `Carousel` com encaixe, arrasto, pontos e setas.
- **React Native:** `Gallery`, `Lightbox` e `Carousel` completos. `AudioPlayer` e `VideoPlayer` são cascas controladas (`playing`, `position`, `duration`, `onPlayPause`, `onSeek`…) para ligar ao `expo-audio` e ao `expo-video`; a onda vem de `waveform` ou da onda padrão.
- Tokens novos de mídia: `--color-media-wave-rest`, `--color-media-surface`, `--color-media-on-surface` e `--color-media-accent`.
