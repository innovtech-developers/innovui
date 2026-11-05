import {
  AudioPlayer,
  Button,
  Card,
  Carousel,
  CarouselItem,
  Gallery,
  Lightbox,
  Stack,
  VideoPlayer,
} from '@innovui/react-native'
import { useEvent } from 'expo'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useRef, useState } from 'react'
import { Image, Text } from 'react-native'
import { Section } from './section'

// Fotos e mídia de exemplo (Unsplash, licença Unsplash): só para o app de demonstração, a
// biblioteca não traz mídia. Os créditos estão em apps/site/public/media/CREDITS.md.
const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?fm=jpg&q=80&w=${width}&auto=format&fit=max`
const ids = [
  'photo-1752490890976-dc8471357439',
  'photo-1663010478036-08ffb115fce0',
  '38/QoR8Bv1S2SEqH6UcSJCA_Tea.jpg',
  'photo-1779223645971-64c5bfe95a3b',
  'photo-1671181366687-47530c4dbe4b',
  'photo-1725307502933-6fff18e99dbe',
]
const alts = [
  'Estrada sinuosa entre montanhas vulcânicas',
  'Via Láctea sobre um lago',
  'Chá e livro ao sol',
  'Ondas do mar vistas de cima',
  'Montanhas nevadas sob céu azul',
  'Viaduto de pedra sobre a floresta',
]
const photo = (n: number, width = 800) => unsplash(ids[n % ids.length] as string, width)
const photos = ids.map((id, i) => ({
  src: unsplash(id, 1600),
  thumbSrc: unsplash(id, 480),
  alt: alts[i] as string,
}))
// Gravações de teste (só locais, fora do git). A onda é o RMS de 52 trechos, calculado fora do app:
// no React Native não há como extrair a onda do áudio.
const AUDIOS = [
  {
    label: 'Mensagem de voz 1',
    source: require('../assets/mensagem-teste.m4a'),
    waveform: [
      0, 0, 0, 0, 0, 0, 0, 0, 0.66, 0.85, 0.71, 0.2, 0.05, 0.03, 0.01, 0.08, 0.15, 0.26, 0.2, 0.17,
      0.06, 0, 0.03, 0.1, 0.11, 0.23, 0.38, 0.86, 1, 1, 1, 0.49, 0.18, 0.06, 0.13, 0.13, 0.1, 0.01,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  {
    label: 'Mensagem de voz 2',
    source: require('../assets/mensagem-teste-2.m4a'),
    waveform: [
      0.33, 0.39, 0.41, 0.48, 0.34, 0.28, 0.01, 0, 0.17, 1, 0.37, 0.58, 0.26, 0.66, 0.42, 0.44,
      0.69, 0.52, 0.39, 0.49, 0.48, 0.35, 0.13, 0.43, 0.52, 0.42, 0.4, 0.84, 0.52, 0.45, 0.02, 0.02,
      0.01, 0.48, 1, 0.61, 0.6, 0.89, 0.82, 0.8, 0.48, 0.02, 0.55, 1, 0.72, 0.25, 0.78, 0.74, 0.37,
      0.17, 0.01, 0.01,
    ],
  },
]
const VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const templates = [
  {
    n: 1,
    title: 'Mensagem de boas-vindas',
    text: 'Primeiro contato com o cliente: apresentação da empresa e os próximos passos.',
  },
  {
    n: 4,
    title: 'Catálogo de produtos',
    text: 'Envio do catálogo com foto, descrição e preço de cada item.',
  },
  {
    n: 0,
    title: 'Confirmação de pedido',
    text: 'Confirme os itens, o pagamento e o prazo de entrega.',
  },
]

function Audio({ label, source, waveform }: (typeof AUDIOS)[number]) {
  const player = useAudioPlayer(source)
  const status = useAudioPlayerStatus(player)

  useEffect(() => {
    // terminou: volta ao começo, pronto para ouvir de novo
    if (status.didJustFinish) player.seekTo(0)
  }, [status.didJustFinish, player])

  return (
    <AudioPlayer
      label={label}
      playing={status.playing}
      position={status.currentTime}
      duration={status.duration}
      waveform={waveform}
      onPlayPause={() => (status.playing ? player.pause() : player.play())}
      onSeek={(seconds) => player.seekTo(seconds)}
      onRateChange={(rate) => player.setPlaybackRate(rate)}
    />
  )
}

function Video() {
  const view = useRef<VideoView>(null)
  const player = useVideoPlayer(VIDEO, (p) => {
    p.timeUpdateEventInterval = 0.25
  })
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing })
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: player.bufferedPosition,
  })
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <VideoPlayer
      label="Vídeo enviado pelo cliente"
      playing={isPlaying}
      position={currentTime}
      duration={player.duration}
      fullscreen={fullscreen}
      onPlayPause={() => (isPlaying ? player.pause() : player.play())}
      onSeek={(seconds) => {
        player.currentTime = seconds
      }}
      onToggleFullscreen={() => view.current?.enterFullscreen()}
    >
      <VideoView
        ref={view}
        player={player}
        nativeControls={false}
        contentFit="contain"
        style={{ flex: 1 }}
        onFullscreenEnter={() => setFullscreen(true)}
        onFullscreenExit={() => setFullscreen(false)}
      />
    </VideoPlayer>
  )
}

export function Media() {
  const [lightbox, setLightbox] = useState(false)

  return (
    <Section title="Mídia">
      {AUDIOS.map((audio) => (
        <Audio key={audio.label} {...audio} />
      ))}
      <Video />
      <Gallery items={photos} />
      <Button variant="secondary" onPress={() => setLightbox(true)}>
        Abrir lightbox
      </Button>
      <Lightbox items={photos} open={lightbox} onOpenChange={setLightbox} />
      <Carousel label="Modelos de mensagem">
        {templates.map(({ n, title, text }) => (
          <CarouselItem key={title}>
            <Card padding="none" className="flex-1 overflow-hidden">
              <Image source={{ uri: photo(n) }} className="aspect-[16/10] w-full" />
              <Stack gap={2} align="start" className="p-4">
                <Text className="text-lg font-semibold text-text-primary">{title}</Text>
                <Text className="text-sm text-text-secondary">{text}</Text>
                <Button variant="ghost">Usar modelo</Button>
              </Stack>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </Section>
  )
}
