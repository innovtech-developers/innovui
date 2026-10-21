import { readdirSync } from 'node:fs'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightLlmsTxt from 'starlight-llms-txt'
import starlightSidebarTopics from 'starlight-sidebar-topics'
import { componentGroups } from './components-nav.mjs'

const CONTRIBUINDO = {
  label: 'Contribuindo',
  link: 'https://github.com/innovtech-developers/innovui/blob/main/CONTRIBUTING.md',
  attrs: { target: '_blank', rel: 'noopener' },
}

export default defineConfig({
  site: 'https://innovui.innovtechsolutions.com.br',
  // a doc web saiu da raiz para /react/ (a raiz agora é só a landing)
  redirects: {
    '/instalacao': '/react/instalacao',
    '/tema': '/react/tema',
    '/acessibilidade': '/react/acessibilidade',
    '/react-native/diferencas': '/react-native/convencoes',
    '/contribuindo': 'https://github.com/innovtech-developers/innovui/blob/main/CONTRIBUTING.md',
    ...Object.fromEntries(
      readdirSync('./src/content/docs/react/components').map((f) => {
        const slug = f.replace(/\.mdx?$/, '')
        return [`/components/${slug}`, `/react/components/${slug}`]
      }),
    ),
  },
  integrations: [
    react(),
    sitemap(),
    starlight({
      title: 'InnovUI',
      description: 'Biblioteca de componentes React e React Native do design system InnovUI.',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
      },
      // @innovui/react/styles.css carrega uma vez para o site inteiro: toda demo viva usa o
      // componente real, estilizado de verdade (sem isso o Button renderiza como <button> cru).
      // o SVG é o favicon principal, mas o Safari não o usa: o .ico (que os navegadores também pedem
      // sozinhos em /favicon.ico) e o apple-touch-icon cobrem o resto
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '48x48' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
      ],
      customCss: [
        './src/styles/layers.css',
        '@innovui/react/styles.css',
        './src/styles/herbarium.css',
      ],
      // Tema único e claro para os blocos de código: sem isso o Expressive Code escolhe
      // dark/light pelo `data-theme` (que por padrão renderiza "dark" no SSR), e o bloco de
      // código vira uma janela quase preta solta dentro da página kraft clara.
      expressiveCode: {
        themes: ['starlight-dark'],
      },
      components: {
        Sidebar: './src/components/Sidebar.astro',
        Hero: './src/components/HerbariumHero.astro',
        // pictograma de categoria ao lado do H1 nas páginas de componente — cumpre o
        // direction contract original ("cada categoria de componente leva um pictograma
        // desenhado à mão"), nunca executado até agora.
        PageTitle: './src/components/HerbariumPageTitle.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/innovtech-developers/innovui',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/innovtech-developers/innovui/edit/main/apps/site/',
      },
      plugins: [
        // llms.txt (índice), llms-full.txt (tudo) e um arquivo por framework, para uma IA ler só a
        // doc do framework que o projeto usa
        starlightLlmsTxt({
          projectName: 'InnovUI',
          rawContent: true,
          description:
            'Design system da Comhub em dois pacotes: @innovui/react (web) e @innovui/react-native (Expo e React Native puro). Componentes tipados, acessíveis, com tema claro e escuro.',
          optionalLinks: [
            {
              label: 'Skill innovui-react',
              url: 'https://innovui.innovtechsolutions.com.br/skills/innovui-react/SKILL.md',
              description: 'skill para assistentes de código usarem o @innovui/react',
            },
            {
              label: 'Skill innovui-react-native',
              url: 'https://innovui.innovtechsolutions.com.br/skills/innovui-react-native/SKILL.md',
              description: 'skill para assistentes de código usarem o @innovui/react-native',
            },
          ],
          customSets: [
            {
              label: 'React',
              description: 'documentação do @innovui/react (web)',
              paths: ['react/**'],
            },
            {
              label: 'React Native',
              description: 'documentação do @innovui/react-native',
              paths: ['react-native/**'],
            },
          ],
        }),
        // um tópico por framework: a sidebar mostra só a documentação do framework escolhido no
        // seletor (TopicsDropdown, em components/Sidebar.astro). Novo framework = novo item aqui
        // + pasta em src/content/docs + entrada em src/frameworks.ts.
        starlightSidebarTopics([
          {
            label: 'React',
            link: '/react/instalacao/',
            items: [
              {
                label: 'Primeiros passos',
                items: [
                  { label: 'Instalação', slug: 'react/instalacao' },
                  { label: 'Tema e customização', slug: 'react/tema' },
                  { label: 'Acessibilidade', slug: 'react/acessibilidade' },
                  { label: 'Usar com IA', slug: 'react/ia' },
                ],
              },
              ...componentGroups('react'),
              CONTRIBUINDO,
            ],
          },
          {
            label: 'React Native',
            link: '/react-native/instalacao/',
            items: [
              {
                label: 'Primeiros passos',
                items: [
                  { label: 'Instalação e configuração', slug: 'react-native/instalacao' },
                  { label: 'Tema e modo escuro', slug: 'react-native/tema' },
                  { label: 'Convenções', slug: 'react-native/convencoes' },
                  { label: 'Acessibilidade', slug: 'react-native/acessibilidade' },
                  { label: 'Usar com IA', slug: 'react-native/ia' },
                ],
              },
              ...componentGroups('react-native'),
              CONTRIBUINDO,
            ],
          },
        ]),
      ],
    }),
  ],
})
