# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Starlight (site, LP + docs) · React 19 + TypeScript + Tailwind CSS v4 (lib). Monorepo pnpm workspaces. Decidido no planejamento (ver SPEC.md), não durante este init.

## Users

Primário: desenvolvedores frontend da Comhub (Brasil), construindo produtos React/Next.js internos, que precisam de componentes prontos, tipados e consistentes com o design system da empresa, para não reimplementar UI do zero em cada projeto. Secundário, à medida que o projeto amadurece: a comunidade open source de devs React/Next.js em geral.

## Product Purpose

InnovUI é uma biblioteca de componentes React (`@innovui/react`) fiel ao Comhub Design System, inspirada no catálogo do Material UI, mais um site com landing page e documentação. Existe para dar aos times da Comhub uma UI pronta, acessível e de alta qualidade, sem recriar o design system em cada app.

## Positioning

Nenhum outro componente de UI no mercado é construído diretamente a partir das variáveis reais do Figma do Comhub Design System (cor, tipografia, espaçamento, raio, sombra), nem já publicado como pacote instalável via npm/pnpm/bun para uso imediato em React/Next.js.

## Operating Context

- Devs instalam `@innovui/react` via npm/pnpm/bun num projeto React 19+ ou Next.js (App Router/Server Components).
- Consultam a documentação no site (Starlight, pt-BR) para ver exemplo vivo, tabela de props e notas de acessibilidade de cada componente.
- Contribuintes seguem o fluxo de PR do CONTRIBUTING.md: changesets, commits semânticos, 85% de cobertura de testes.
- O site é hospedado via Docker no Coolify, no domínio `innovui.innovtechsolutions.com.br`.

## Capabilities and Constraints

- Componentes React 19+ (sem suporte a React 18), ESM, `"use client"` em componentes interativos.
- CSS compilado e distribuído pela própria lib (`@innovui/react/styles.css`); não exige Tailwind no projeto consumidor.
- Tema via CSS custom properties, sem `ThemeProvider` em JS.
- Escopo de componentes: os 25 componentes atualmente desenhados no Figma do Comhub Design System (fases 0–3, ver SPEC.md); componentes além do Figma só entram como "derivados do DS" (reaproveitando tokens existentes, nunca inventando novos).
- Modo escuro: estrutura de tokens existe no Figma, mas os valores ainda não foram lidos/publicados (gap conhecido, ver PLAN.md T2.1).
- Licença MIT, open source, repositório em `github.com/innovtech-developers/innovui`.

## Brand Commitments

- Nome do produto: **InnovUI**.
- Cor primária: roxo (`#9035EE`, `purple/600` do Comhub Design System) — confirmado como padrão da marca.
- Ícones: `lucide-react`.
- Código, commits e API em inglês; documentação do site, README e CONTRIBUTING em português (público inicial é a própria equipe da Comhub).

## Evidence on Hand

- O design system completo da Comhub (Figma `Qi9eahiHd9Zn6b0ZbffmKB`, "Comhub Design System v2.1"), lido via Figma MCP: tokens, tipografia, espaçamento, componentes e suas variantes/estados reais.
- A documentação oficial do design system (markdown fornecido pelo usuário, convertido do PDF original) data a versão v2.1 como "agosto/2026" — fonte do "coletado ago/2026" usado no selo do Button na landing page.
- Nenhum depoimento, caso de uso publicado, ou métrica de adoção ainda — o produto está em desenvolvimento inicial, sem usuários reais além da própria equipe interna. Não inventar depoimentos, logos de clientes ou números de adoção.

## Product Principles

1. O Figma é a fonte de verdade — nunca inventar token ou variante que não exista nele (ou, para componentes derivados, nunca usar valor que não seja um token já existente).
2. Acessibilidade é requisito de todo componente, não um extra — testada automaticamente (axe) em cada um.
3. A lib nunca deve exigir que o projeto consumidor tenha Tailwind instalado ou configurado.
4. Excelente UX de desenvolvedor: instalar, importar um CSS, e usar — sem fricção.
5. Documentação em pt-BR é tratada com o mesmo nível de cuidado que o código em inglês.

<!-- Derivado de SPEC.md e PLAN.md (já confirmados com o usuário em 2026-10-01), não de uma nova entrevista. -->
