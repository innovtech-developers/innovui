import { fadeStyles } from './motion'

/**
 * Backdrop de Modal e Drawer: `surface/overlay` na opacidade do tema (50% no claro, 70% no escuro)
 * com blur de 16px. A opacidade vai na cor, não no elemento, para o blur não desbotar junto.
 */
export const overlayStyles = `${fadeStyles} iu:fixed iu:inset-0 iu:z-50 iu:bg-[color-mix(in_srgb,var(--color-surface-overlay)_calc(var(--surface-overlay-opacity)*100%),transparent)] iu:backdrop-blur-[16px]`
