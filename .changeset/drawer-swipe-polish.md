---
'@innovui/react': minor
---

Arrastar para fechar o Drawer: o backdrop clareia junto com o painel; quando o gesto começa rolando o conteúdo e este chega ao começo, o painel assume o resto do arraste (e devolve a rolagem se o dedo recuar); e corrigido um salto ao soltar antes do limite, em que a animação de entrada do painel reiniciava durante a volta. Novo `showHandle` (padrão `true`): barrinha de arraste do Figma (40px) nos painéis `top` e `bottom`.
