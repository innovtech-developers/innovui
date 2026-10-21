import react from '../../../packages/react/package.json'
import reactNative from '../../../packages/react-native/package.json'

const atom = `<ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>`

// um por tópico da sidebar (astro.config.mjs); a chave é o 1º segmento da URL do tópico.
// `version` é a versão do pacote neste checkout. `logo` é o miolo de um SVG 24×24 de traço.
// ponytail: só a versão atual; um seletor de versões precisa de docs arquivadas por versão
// (ex.: starlight-versions ou um deploy por tag), que ainda não existem.
export const frameworks: Record<string, { pkg: string; version: string; logo: string }> = {
  react: { pkg: react.name, version: react.version, logo: atom },
  // o mesmo átomo dentro de um aparelho: o que diferencia o mobile
  'react-native': {
    pkg: reactNative.name,
    version: reactNative.version,
    logo: `<rect x="6" y="1.5" width="12" height="21" rx="2.5"/><g transform="translate(7.5 7.5) scale(.375)">${atom}</g>`,
  },
}
