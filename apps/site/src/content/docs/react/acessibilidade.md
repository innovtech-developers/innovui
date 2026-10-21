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

## Contraste

Os valores de cor vêm dos tokens do design system, e o `jest-axe` **não mede contraste** (o jsdom não calcula cores renderizadas). Por isso a medição é outra: um teste automático (`tokens.test.ts`) calcula a razão de contraste WCAG de 42 pares de texto sobre fundo, nos dois modos, e falha o build se algum ficar abaixo de **4,5:1**. O ✓ branco do Stepper, que é um gráfico, precisa de 3:1.

**Exceções documentadas pelo design system** (conteúdo não essencial, abaixo de 4,5:1 de propósito): `text/tertiary`, `text/disabled` e o placeholder dos campos.

**Ajustes de contraste.** Treze valores de cor (2 no claro e 11 no escuro) foram ajustados para chegar a 4,5:1: texto de sucesso no claro; `text/secondary`, `text/brand`, erro, info, `interactive/primary` e `interactive/destructive` no escuro.

Se o seu produto usa outras combinações de cor, valide o par novo nos dois modos e, onde a cor for o único sinal, junte um ícone e um rótulo (veja [Tema e customização](/react/tema/)).
