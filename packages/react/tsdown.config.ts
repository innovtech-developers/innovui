import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'browser',
  dts: true,
  unbundle: true, // preserva um arquivo por módulo, para o "use client" sobreviver por componente
  clean: true,
  sourcemap: true,
})
