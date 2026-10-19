---
title: Acessibilidade
description: O compromisso de acessibilidade do InnovUI e como ele é verificado.
---

Acessibilidade não é um extra no InnovUI — é um requisito de cada componente, testado automaticamente.

## O que é garantido

- **Navegação por teclado** em todo elemento interativo (Tab, Enter, Espaço, Esc e setas onde fizer sentido, como em Tabs e Menus).
- **Foco visível**, com o anel de foco do design system (`border/focus`).
- **Contraste** dos tokens do design system em texto sobre fundo, com as exceções listadas em [Contraste: exceções conhecidas](#contraste-exceções-conhecidas).
- **ARIA correto** — `role`, `aria-label`, `aria-busy`, `aria-disabled` e afins, aplicados conforme o padrão [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/) de cada tipo de componente.

## Como é testado

Todo componente tem um teste automatizado com [jest-axe](https://github.com/nickcolley/jest-axe), que roda o [axe-core](https://github.com/dequelabs/axe-core) sobre o HTML renderizado e falha o build se houver qualquer violação. Isso roda no CI, em todo PR.

Isso cobre violações mecânicas (contraste, atributos ARIA ausentes ou inválidos, labels faltando). Não substitui teste manual com leitor de tela — se você encontrar um problema de uso real, [abra uma issue](https://github.com/innovtech-developers/innovui/issues).

## Contraste: exceções conhecidas

Os valores de cor vêm direto do design system (Figma), e o `jest-axe` **não mede contraste** (o jsdom não calcula cores renderizadas). Por isso medimos à mão os pares de token e estes ficam **abaixo de 4.5:1**:

| Par | Claro | Escuro |
|---|---|---|
| `text/tertiary` e `text/disabled` sobre o fundo | 2.55 / 1.48 | 3.77 / 2.37 |
| Placeholder dos campos (`field/text/placeholder`) | 2.55 | 3.77 |
| Texto de sucesso sobre `bg/success` (Badge, Alert, Banner, Toast) | 3.10 | — |
| Texto de erro sobre `bg/error` | — | 3.59 |
| Texto de info sobre `bg/info` | — | 4.20 |
| `text/secondary` sobre `surface/elevated` e `bg/tertiary` (ex.: corpo do Modal) | — | 4.03 |
| Botão secundário (`button/secondary`) | — | 4.09 |
| Botão destrutivo (texto sobre `button/destructive/bg`) | — | 4.40 |
| ✓ do Stepper (branco sobre `bg/success-emphasis`) | 2.23 | — |

`text/tertiary`, `text/disabled` e o placeholder são exceções documentadas do design system (conteúdo não essencial). Os demais pares são decisões de cor do Figma que mantivemos fiéis; se o seu produto exige AA nesses casos, sobrescreva o token (veja [Tema e customização](/tema/)) ou combine o texto com um ícone e um rótulo, para que a cor nunca seja o único sinal.
