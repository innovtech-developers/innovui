---
'@innovui/react': patch
---

Ajusta o contraste de 13 cores (2 no claro, 11 no escuro) para que todo par de texto do design system chegue a 4,5:1: texto de sucesso no claro; `text/secondary`, `text/brand`, erro, info, primário e destrutivo no escuro (com a escada de hover e active dos botões). Os valores seguem as sugestões do designer e divergem temporariamente das variáveis do Figma. Um teste de contraste passa a proteger os pares nos dois modos.
