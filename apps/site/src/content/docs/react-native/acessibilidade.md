---
title: Acessibilidade
description: Como os componentes do @innovui/react-native funcionam com VoiceOver e TalkBack.
---

Os componentes usam as props de acessibilidade nativas do React Native, para funcionar com o VoiceOver (iOS) e o TalkBack (Android).

## O que os componentes fazem

- **Roles:** cada componente declara o `accessibilityRole` do seu tipo (`button`, `checkbox`, `radio` e `radiogroup`, `switch`, `tab` e `tablist`, `combobox`, `menu` e `menuitem`, `progressbar`, `adjustable` no Slider, `link`, `image` no Avatar, `header` no título de Modal e Drawer).
- **Estados:** `accessibilityState` recebe `disabled`, `busy`, `selected` e `checked`, conforme o componente.
- **Rótulos:** o texto visível é o rótulo. Onde não há texto (IconButton, Spinner, o × de Modal e Drawer), passe `accessibilityLabel`. O Field associa rótulo, ajuda e erro ao controle por `accessibilityLabel` e `accessibilityHint`.
- **Overlays:** Modal, Drawer e Popover usam `accessibilityViewIsModal`, que mantém o leitor de tela dentro do conteúdo no iOS. O botão voltar do Android e o toque no fundo fecham.
- **Avisos:** o Toast é uma região ao vivo (`accessibilityLiveRegion`): `assertive` para `error` e `warning`, `polite` para os demais. Alert e Banner usam `accessibilityRole="alert"` nos status `error` e `warning`.

## Movimento

Modal, os overlays ancorados, Tabs, SegmentedControl e Toast respeitam a opção "Reduzir movimento" do sistema. Skeleton, Spinner, Switch e Accordion ainda não respeitam.

## Contraste

Os tokens de cor são os mesmos do `@innovui/react`, gerados do mesmo arquivo de origem. Os pares de texto sobre fundo, nos dois temas, são validados em 4,5:1 por um teste automático, com as exceções do design system (`text/tertiary`, `text/disabled` e o placeholder dos campos). Se o seu produto usa outras combinações de cor, valide o par novo nos dois temas e, onde a cor for o único sinal, junte um ícone e um rótulo (veja [Tema e modo escuro](/react-native/tema/)).

## O que não existe

- **Teclado e foco:** não há navegação por teclado nem foco visível. O toque e os gestos do leitor de tela são a interação.
- **Tamanho do alvo de toque:** o Button tem 36, 44 e 56 pontos de altura. Os componentes pequenos (Checkbox, Radio, Switch) seguem o tamanho do design system, sem área extra de toque.

## Como é testado

Os testes usam o [Testing Library](https://callstack.github.io/react-native-testing-library/) e verificam roles, estados e rótulos de cada componente. Não existe um equivalente do axe para o React Native: teste os fluxos do seu app com VoiceOver e TalkBack. Se encontrar um problema de uso real, [abra uma issue](https://github.com/innovtech-developers/innovui/issues).
