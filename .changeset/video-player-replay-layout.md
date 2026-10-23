---
'@innovui/react': patch
'@innovui/react-native': minor
---

VideoPlayer (web): em players estreitos (< 560px) a barra de posição desce para a borda de baixo, abaixo dos botões, e o play central é menor, então os dois não se sobrepõem; em players largos a barra continua acima dos botões.

VideoPlayer (React Native): novo layout para o celular, com play/pause grande no centro e, embaixo, o tempo com a tela cheia à direita e a barra de posição (botões de 44px, barra com 32px de área de toque e marcador). O botão de mudo saiu, junto com as props `muted` e `onToggleMute`: no celular o volume é o do aparelho. Tocar no vídeo agora só mostra ou esconde os controles, em vez de pausar. Reproduzir depois do fim volta ao começo (o `play()` do expo-video não faz nada no fim do vídeo).
