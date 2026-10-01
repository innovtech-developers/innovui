---
title: Acessibilidade
description: O compromisso de acessibilidade do InnovUI e como ele é verificado.
---

Acessibilidade não é um extra no InnovUI — é um requisito de cada componente, testado automaticamente.

## O que é garantido

- **Navegação por teclado** em todo elemento interativo (Tab, Enter, Espaço, Esc e setas onde fizer sentido, como em Tabs e Menus).
- **Foco visível**, com o anel de foco do design system (`border/focus`).
- **Contraste mínimo AA** (4.5:1) em texto sobre fundo, exceto onde o próprio design system documenta a exceção (ex.: `text/tertiary`, reservado para conteúdo não essencial).
- **ARIA correto** — `role`, `aria-label`, `aria-busy`, `aria-disabled` e afins, aplicados conforme o padrão [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/) de cada tipo de componente.

## Como é testado

Todo componente tem um teste automatizado com [jest-axe](https://github.com/nickcolley/jest-axe), que roda o [axe-core](https://github.com/dequelabs/axe-core) sobre o HTML renderizado e falha o build se houver qualquer violação. Isso roda no CI, em todo PR.

Isso cobre violações mecânicas (contraste, atributos ARIA ausentes ou inválidos, labels faltando). Não substitui teste manual com leitor de tela — se você encontrar um problema de uso real, [abra uma issue](https://github.com/innovtech-developers/innovui/issues).
