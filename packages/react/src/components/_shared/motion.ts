/** Entrada e saída dos overlays; `motion-safe:` desliga tudo com `prefers-reduced-motion`. */
export const fadeStyles =
  'iu:motion-safe:animate-fade-in iu:motion-safe:data-[state=closed]:animate-fade-out'
export const popStyles =
  'iu:motion-safe:animate-pop-in iu:motion-safe:data-[state=closed]:animate-pop-out'
export const dialogStyles =
  'iu:motion-safe:animate-dialog-in iu:motion-safe:data-[state=closed]:animate-dialog-out'
export const drawerStyles =
  'iu:motion-safe:animate-drawer-in iu:motion-safe:data-[state=closed]:animate-drawer-out'
export const toastStyles =
  'iu:motion-safe:animate-toast-in iu:motion-safe:data-[state=closed]:animate-toast-out'
export const accordionStyles =
  'iu:motion-safe:data-[state=open]:animate-accordion-down iu:motion-safe:data-[state=closed]:animate-accordion-up'
