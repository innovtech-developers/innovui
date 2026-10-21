import type { APIRoute, GetStaticPaths } from 'astro'

// serve as skills em /skills/<nome>/SKILL.md com charset: o middleware de arquivos estáticos
// manda `text/markdown` sem charset e o navegador lê o UTF-8 como Latin-1 (acentos quebrados)
const skills = import.meta.glob<string>('../../../skills/*/SKILL.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const getStaticPaths = (() =>
  Object.keys(skills).map((path) => ({
    params: { name: path.split('/').at(-2) },
    props: { body: skills[path] },
  }))) satisfies GetStaticPaths

export const GET: APIRoute = ({ props }) =>
  new Response(props.body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
