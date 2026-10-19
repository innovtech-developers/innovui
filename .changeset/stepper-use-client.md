---
'@innovui/react': patch
---

Corrige o `Stepper` em Server Components: o arquivo usava `createContext` sem `'use client'`, o que quebrava o `next build` de quem importava o componente numa página de servidor.
