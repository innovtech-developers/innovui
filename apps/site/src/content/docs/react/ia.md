---
title: Usar com IA
description: O llms.txt e a skill do @innovui/react para assistentes de código como o Claude Code.
---

Para um assistente de código acertar as props e as convenções do `@innovui/react`, dê a ele a documentação e a skill abaixo.

## llms.txt

A documentação está disponível em texto puro, no formato [llms.txt](https://llmstxt.org):

| Arquivo | Conteúdo |
|---|---|
| [/llms.txt](/llms.txt) | Índice com os links dos outros arquivos. |
| [/_llms-txt/react.txt](/_llms-txt/react.txt) | Toda a documentação do `@innovui/react`. É o que costuma bastar. |
| [/llms-small.txt](/llms-small.txt) | Versão reduzida da documentação dos dois pacotes. |
| [/llms-full.txt](/llms-full.txt) | Toda a documentação, dos dois pacotes. |

Em ferramentas que aceitam uma URL como contexto, passe o arquivo do seu framework: `https://innovui.innovtechsolutions.com.br/_llms-txt/react.txt`.

## Skill

A skill `innovui-react` ensina o assistente a instalar e configurar o pacote, a seguir as regras do React na web e a consultar a página certa de cada componente. Para o [Claude Code](https://claude.com/claude-code), baixe o arquivo para a pasta de skills do projeto:

```sh
mkdir -p .claude/skills/innovui-react
curl -o .claude/skills/innovui-react/SKILL.md https://innovui.innovtechsolutions.com.br/skills/innovui-react/SKILL.md
```

Para valer em todos os seus projetos, use `~/.claude/skills/innovui-react` no lugar de `.claude/skills/innovui-react`. O arquivo é Markdown comum: em outras ferramentas, copie o conteúdo para o arquivo de instruções delas.

O código fonte da skill fica em [SKILL.md](/skills/innovui-react/SKILL.md).
