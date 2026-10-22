---
'@innovui/react': patch
'@innovui/react-native': patch
---

Corrige os players de mídia no celular.

- **AudioPlayer (React e React Native):** em telas estreitas a onda passava por cima do tempo e do botão de velocidade. Agora ela mede a largura e desenha só as barras que cabem (no mínimo 2px, com 2px de espaço), nunca mais que `bars`.
- **VideoPlayer (React):** em vídeos pequenos a faixa de controles cobria o play central e engolia o toque, então o vídeo não tocava. A faixa deixa o toque passar; só a barra de posição e os botões o recebem.
