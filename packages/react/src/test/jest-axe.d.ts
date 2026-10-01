import 'vitest'

// jest-axe só declara tipos para o Jest; aqui estendemos o matcher do Vitest.
interface CustomMatchers<R = unknown> {
  toHaveNoViolations(): R
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
