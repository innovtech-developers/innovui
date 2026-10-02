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
      components: {
        Hero: './src/components/HerbariumHero.astro',
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
