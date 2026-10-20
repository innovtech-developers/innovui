// Mock do Uniwind para o Jest (que não passa pelo Metro). Os testes conferem as classes aplicadas;
// os valores dos tokens só existem no bundle do Metro, então `useCSSVariable` devolve `undefined`.
// Para testar o tema escuro: `jest.mocked(useUniwind).mockReturnValue({ theme: 'dark', ... })`.
export const useCSSVariable = jest.fn((_name: string | string[]): string | undefined => undefined)
export const useUniwind = jest.fn(() => ({ theme: 'light', hasAdaptiveThemes: false }))
export const useResolveClassNames = jest.fn((_className: string) => ({}))
export const Uniwind = { setTheme: jest.fn(), updateCSSVariables: jest.fn() }
