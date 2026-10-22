import { existsSync, readdirSync } from 'node:fs'

// Categorias da sidebar de componentes (as mesmas nos dois frameworks). Componente novo precisa
// entrar aqui: o build falha se uma página de componente ficar sem categoria.
const CATEGORIES = {
  Ações: ['button', 'icon-button', 'link'],
  Formulários: [
    'field',
    'input',
    'textarea',
    'select',
    'combobox',
    'checkbox',
    'radio',
    'switch',
    'slider',
    'date-picker',
    'date-range-picker',
    'calendar',
    'upload',
  ],
  'Exibição de dados': ['avatar', 'badge', 'tag', 'card', 'list', 'table', 'accordion'],
  Feedback: ['alert', 'banner', 'toast', 'skeleton', 'spinner'],
  Navegação: ['tabs', 'segmented-control', 'breadcrumb', 'pagination', 'stepper'],
  Sobreposições: ['modal', 'drawer', 'popover', 'menu', 'tooltip'],
  Layout: ['container', 'grid', 'stack', 'divider'],
  Mídia: ['audio-player', 'video-player', 'gallery', 'lightbox', 'carousel'],
}

/**
 * Um grupo "Componentes" (recolhível) com as categorias dentro. As categorias são grupos do
 * Starlight sempre abertos; o Sidebar.astro as desenha como títulos fixos, sem abrir/fechar.
 * Só entram os componentes que existem em `docs/<framework>/components`.
 */
export function componentGroups(framework) {
  const dir = `./src/content/docs/${framework}/components`
  const files = new Set(readdirSync(dir).map((f) => f.replace(/\.mdx?$/, '')))
  const categorized = new Set(Object.values(CATEGORIES).flat())
  const orphans = [...files].filter((f) => !categorized.has(f))
  if (orphans.length) {
    throw new Error(`components-nav.mjs: sem categoria em ${framework}: ${orphans.join(', ')}`)
  }
  const categories = Object.entries(CATEGORIES).map(([label, slugs]) => ({
    label,
    collapsed: false,
    items: slugs
      .filter((s) => existsSync(`${dir}/${s}.mdx`))
      .map((s) => ({ slug: `${framework}/components/${s}` })),
  }))
  return [{ label: 'Componentes', collapsed: true, items: categories }]
}
