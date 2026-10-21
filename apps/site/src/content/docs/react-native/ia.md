---
title: Usar com IA
description: O llms.txt e a skill do @innovui/react-native para assistentes de código como o Claude Code.
---

Para um assistente de código acertar as props e as convenções do `@innovui/react-native`, dê a ele a documentação e a skill abaixo.

## llms.txt

A documentação está disponível em texto puro, no formato [llms.txt](https://llmstxt.org):

| Arquivo | Conteúdo |
|---|---|
| [/llms.txt](/llms.txt) | Índice com os links dos outros arquivos. |
| [/_llms-txt/react-native.txt](/_llms-txt/react-native.txt) | Toda a documentação do `@innovui/react-native`. É o que costuma bastar. |
| [/llms-small.txt](/llms-small.txt) | Versão reduzida da documentação dos dois pacotes. |
| [/llms-full.txt](/llms-full.txt) | Toda a documentação, dos dois pacotes. |

Em ferramentas que aceitam uma URL como contexto, passe o arquivo do seu framework: `https://innovui.innovtechsolutions.com.br/_llms-txt/react-native.txt`.

## Skill

A skill `innovui-react-native` ensina o assistente a instalar e configurar o pacote, a seguir as regras do React Native e a consultar a página certa de cada componente. Para o [Claude Code](https://claude.com/claude-code), baixe o arquivo para a pasta de skills do projeto:

```sh
mkdir -p .claude/skills/innovui-react-native
curl -o .claude/skills/innovui-react-native/SKILL.md https://innovui.innovtechsolutions.com.br/skills/innovui-react-native/SKILL.md
```

Para valer em todos os seus projetos, use `~/.claude/skills/innovui-react-native` no lugar de `.claude/skills/innovui-react-native`. O arquivo é Markdown comum: em outras ferramentas, copie o conteúdo para o arquivo de instruções delas.

O código fonte da skill fica em [SKILL.md](/skills/innovui-react-native/SKILL.md).
