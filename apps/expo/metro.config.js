const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')

const config = getDefaultConfig(__dirname)

// Em desenvolvimento a lib vem direto do código-fonte (sem precisar de build a cada mudança).
const libEntry = path.resolve(__dirname, '../../packages/react-native/src/index.ts')
const resolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@innovui/react-native') return { type: 'sourceFile', filePath: libEntry }
  return (resolveRequest ?? context.resolveRequest)(context, moduleName, platform)
}

// withUniwindConfig precisa ser o wrapper mais externo.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
})
