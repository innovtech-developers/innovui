/// <reference path="../node_modules/starlight-sidebar-topics/dist/global.d.ts" />

// módulos virtuais do Starlight usados pelo components/Search.astro (cópia do original)
declare module 'virtual:starlight/project-context' {
  const project: { trailingSlash: 'always' | 'never' | 'ignore' }
  export default project
}
declare module 'virtual:starlight/pagefind-config' {
  export const pagefindUserConfig: Record<string, unknown>
}
