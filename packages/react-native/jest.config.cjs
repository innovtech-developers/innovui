module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: { '^uniwind$': '<rootDir>/src/test/uniwind.ts' },
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
