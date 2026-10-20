import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'neutral', // o Metro resolve react-native; nada aqui depende de DOM ou Node
  dts: true,
  unbundle: true,
  clean: true,
  sourcemap: true,
})
