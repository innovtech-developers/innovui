---
'@innovui/react': patch
---

AudioPlayer: a onda extraída do áudio agora usa o volume (RMS) de cada trecho, normalizado pela segunda ou terceira barra mais alta, em vez do pico. Antes qualquer ruído levantava as barras e os áudios ficavam todos com a mesma onda; agora as pausas e a voz baixa aparecem, como nos mensageiros.
