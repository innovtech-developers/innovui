---
'@innovui/react': minor
---

Adiciona o modo escuro. Os mesmos tokens semânticos e de componente passam a resolver para os valores do modo Dark do design system quando há `class="dark"` ou `data-theme="dark"` no `<html>` (ou em qualquer elemento): nenhum componente muda. O fundo do Modal fica mais opaco no escuro (`--surface-overlay-opacity`: 50% → 70%). A ativação não é automática por `prefers-color-scheme`; veja "Tema e customização" na documentação.
