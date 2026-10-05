import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://innovui.innovtechsolutions.com.br',
  integrations: [
    react(),
    sitemap(),
    starlight({
      title: 'InnovUI',
      description: 'Biblioteca de componentes React do design system InnovUI.',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
      },
      // @innovui/react/styles.css carrega uma vez para o site inteiro: toda demo viva usa o
      // componente real, estilizado de verdade (sem isso o Button renderiza como <button> cru).
      customCss: ['@innovui/react/styles.css', './src/styles/herbarium.css'],
      // Tema único e claro para os blocos de código: sem isso o Expressive Code escolhe
      // dark/light pelo `data-theme` (que por padrão renderiza "dark" no SSR), e o bloco de
      // código vira uma janela quase preta solta dentro da página kraft clara.
      expressiveCode: {
        themes: ['starlight-dark'],
      },
      components: {
        Hero: './src/components/HerbariumHero.astro',
        // sem tokens de modo escuro publicados ainda, o seletor padrão só fingiria escolha
        ThemeSelect: './src/components/EmptyThemeSelect.astro',
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
      sidebar: [
        {
          label: 'Primeiros passos',
          items: [
            { label: 'Instalação', slug: 'instalacao' },
            { label: 'Tema e customização', slug: 'tema' },
            { label: 'Acessibilidade', slug: 'acessibilidade' },
            { label: 'Contribuindo', slug: 'contribuindo' },
          ],
        },
        {
          label: 'Componentes',
          items: [{ autogenerate: { directory: 'components' } }],
        },
      ],
    }),
  ],
})
