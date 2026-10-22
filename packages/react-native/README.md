# @innovui/react-native

Componentes React Native do design system InnovUI, estilizados com [Uniwind](https://docs.uniwind.dev) (Tailwind v4 para React Native). Os mesmos componentes do `@innovui/react`, adaptados à plataforma.

## Instalação

```bash
pnpm add @innovui/react-native uniwind tailwindcss react-native-svg
```

No app, siga o [quickstart do Uniwind](https://docs.uniwind.dev/quickstart) (`withUniwindConfig` no `metro.config.js`) e, no `global.css`, importe os tokens e aponte o Tailwind para as classes da lib:

```css
@import 'tailwindcss';
@import 'uniwind';
@import '@innovui/react-native/theme.css';

@source '../node_modules/@innovui/react-native/dist';
```

O `@source` é necessário porque o Tailwind só gera as classes que encontra nos arquivos escaneados (num monorepo pnpm, aponte para o caminho real do pacote).

```tsx
import { Button } from '@innovui/react-native'

export function App() {
  return <Button onPress={() => {}}>Salvar</Button>
}
```

## Tema claro e escuro

`theme.css` define todos os tokens do `tokens.css` como variáveis por tema (`light` e `dark`); cada um vira utilitário (`--color-button-primary-bg` → `bg-button-primary-bg`), inclusive para o seu código. Troque o tema com o Uniwind: `Uniwind.setTheme('light' | 'dark' | 'system')`.

## Diferenças em relação ao `@innovui/react`

- **Texto:** no native o texto não herda cor nem tamanho; os componentes aplicam `Text` por conta própria. Onde o web aceita `ReactNode`, alguns componentes aceitam só `string` (Badge, Tag, Alert `title`, itens de Menu...).
- **Eventos e acessibilidade:** `onClick` vira `onPress`; `aria-*` vira `accessibility*`. Não existe hover nem foco por teclado.
- **Sem `asChild`:** gatilhos de Modal, Drawer, Popover, Menu e Tooltip recebem o elemento clonado com `onPress` (o Tooltip abre no `onLongPress`).
- **Overlays:** Modal, Drawer, Popover, Menu, Select e Combobox usam o `Modal` nativo do RN. Sem blur no backdrop. Envolva o app em `ToastProvider` para usar `useToast()`.
- **Upload:** o RN não tem `<input type="file">`. O `Upload` é controlado: o consumidor abre o seletor (ex. `expo-document-picker`) em `onPick` e passa a lista em `files`.
- **AudioPlayer e VideoPlayer:** o React Native não tem player de mídia embutido, então são cascas controladas: você guarda o estado (por exemplo com `expo-audio` e `expo-video`) e o passa por props (`playing`, `position`, `duration`…), ligando `onPlayPause`, `onSeek` etc. ao player de verdade. A onda do AudioPlayer vem de `waveform` (ou da onda padrão): no native não há extração automática. Gallery, Lightbox e Carousel são completos.
- **Grid e Table:** feitos com Views e flexbox (sem CSS grid). Breakpoints vêm de `useWindowDimensions`.
- **Sombras no Android:** `shadow-*` não gera `elevation`.

## Decisões

- **Uniwind em vez de `StyleSheet`:** os componentes usam `className`, como no `@innovui/react`, e o consumidor pode sobrescrever classes (`<Button className="h-20" />`, resolvido com `tailwind-merge`). Exige `react-native >= 0.81` e Metro.
- **Tokens:** `theme.css` e `src/tokens/generated.ts` (para usos fora de `className`) são gerados de `packages/react/src/styles/tokens.css`. Rode `pnpm --filter @innovui/react-native generate:tokens` depois de mudar os tokens; `pnpm test` falha se estiverem defasados.
- **API:** igual à do `@innovui/react` sempre que possível (`variant`, `size`, `loading`, `leadingIcon`, `trailingIcon`). Diferenças vêm da plataforma (`onPress` no lugar de `onClick`; o hover vira `active:`).
- **Testes:** o Jest não passa pelo Metro, então os testes conferem as classes aplicadas, não os estilos resolvidos. A geração dos estilos foi verificada com um bundle real do Metro.

## Desenvolvimento

```bash
pnpm --filter @innovui/react-native test
pnpm --filter @innovui/react-native typecheck
pnpm --filter @innovui/react-native build
```
