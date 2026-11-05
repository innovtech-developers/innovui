---
'@innovui/react-native': patch
---

O Skeleton ocupa a largura do contêiner por padrão. Antes as variantes vinham com largura fixa (200, 160 ou 300 px), então `<Skeleton className="h-[76px] rounded-xl" />` ficava com 200 px alinhado à esquerda. Para largura fixa, passe `className="w-[200px]"`. O avatar continua com 40 x 40.
