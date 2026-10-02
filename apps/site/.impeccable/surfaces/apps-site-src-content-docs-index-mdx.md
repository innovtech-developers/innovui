---
version: 1
slug: "apps-site-src-content-docs-index-mdx"
primary_target: "apps/site/src/content/docs/index.mdx"
related_targets: []
---

# Surface: Landing page (`apps/site/src/content/docs/index.mdx`)

Mode: **Persuade**. Audience: devs frontend da Comhub (pt-BR), depois comunidade open source.
Job: decidir instalar `@innovui/react` e saber como. Proof: o próprio design system real (tokens do
Figma), o Button já publicado, a doc viva. Constraint: roxo `#9035EE` é compromisso de marca (ver
PRODUCT.md), não pode ser diluído; nenhuma claim/depoimento inventado (ainda não existem).

## Direction contract

**THESIS:** InnovUI se apresenta como um herbário de espécimes de interface — cada componente é um
espécime montado, catalogado e rotulado, não um card de SaaS genérico com gradiente e ícone
flutuante (o óbvio da categoria, e seu oposto previsível, um dashboard escuro neon-terminal, ficam
de fora).

**OWN-WORLD:** fundo kraft/manila (não creme/parchment — ver calibração), tinta preta de precisão
para toda estrutura e type, carimbo roxo `#9035EE` (a cor de marca real, usada com a autoridade de
um carimbo de coleção, nunca diluída) para todo estado ativo/interativo. Rótulos em mono/typewriter
para metadados (variante, tamanho, estado), serifa de precisão para o nome do "espécime". Cada
categoria de componente leva um pictograma desenhado à mão, estilo prancha científica, no próprio
roxo de carimbo — nunca ícone de biblioteca genérica.

**STORY:** o visitante entende em segundos que estes são componentes reais, extraídos de um design
system real (não mockups), prova viva: mexe num specimen (ex. o Button) e vê os tokens/medidas
atualizarem ao vivo — e sai sabendo exatamente o comando de instalação.

**FIRST VIEWPORT:** título "InnovUI" em serifa grande sobre o fundo kraft, como o rótulo principal
de uma prancha de herbário; abaixo, a tagline como legenda de coleção; um Button real "montado" como
primeiro espécime, com fita de montagem e um rótulo de coleta (nome, variante, "coletado em" = data
do design system); comando de instalação copiável logo abaixo, como a ficha técnica do espécime; CTA
primário (Button real, variant primary) levando a /instalacao, CTA secundário (Button ghost) para o
GitHub.

**FORM:** herbário/prancha científica (candidato #5 da minha lista própria, ranqueada por
ressonância para um público de devs de design system). Seed key: `7131cd4b`.
Reforços doados pelos challengers do catálogo: do candidato cartografia (mapa do tesouro) — uma
disciplina de "anotar/comparar" aplicada à doc de cada componente (comparar variantes lado a lado);
do candidato type-specimen (fonte variável) — a interação de assinatura: arrastar um controle de
prop e ver o specimen inteiro (e seu rótulo de medidas) atualizar ao vivo; do candidato
push-pin-poster — só a disciplina de "um pictograma-âncora por seção", nunca sua paleta candy.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- Modo escuro ainda não existe (gap conhecido do design system); a LP é só modo claro por ora.
- Sem geração de imagem disponível nesta sessão: build code-led, sem comp aprovado; a ambição vive
  neste contrato e é auditada no finish review.
