module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^uniwind$': '<rootDir>/src/test/uniwind.ts',
    // O preset resolve o react-native pelo `.pnpm`, que pode trazer o do app Expo (outra versão).
    '^react-native($|/.*)': `${require('node:path').dirname(require.resolve('react-native'))}/$1`,
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  // O preset não enxerga os caminhos `.pnpm/@react-native+...`; o `.pnpm` precisa passar pelo filtro.
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/index.ts',
    '!src/test/**',
    '!src/tokens/generated.ts',
  ],
}
