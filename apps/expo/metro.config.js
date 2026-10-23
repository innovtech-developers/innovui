const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')

const config = getDefaultConfig(__dirname)

// Em desenvolvimento a lib vem direto do código-fonte (sem precisar de build a cada mudança).
const libEntry = path.resolve(__dirname, '../../packages/react-native/src/index.ts')
// A lib tem o próprio node_modules (outra versão do React Native). Como o app roda o código-fonte
// dela, estes pacotes precisam vir sempre do app: duas cópias quebram o React e o RN em runtime.
const singletons = ['react', 'react-native', 'react-native-svg', 'uniwind']
const appOrigin = path.resolve(__dirname, 'App.tsx')
const resolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@innovui/react-native') return { type: 'sourceFile', filePath: libEntry }
  if (singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`))) {
    const fromApp = { ...context, originModulePath: appOrigin }
    return (resolveRequest ?? context.resolveRequest)(fromApp, moduleName, platform)
  }
  return (resolveRequest ?? context.resolveRequest)(context, moduleName, platform)
}

// withUniwindConfig precisa ser o wrapper mais externo.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
})
