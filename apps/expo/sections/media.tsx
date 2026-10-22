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
const AUDIO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
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

function Audio() {
  const player = useAudioPlayer(AUDIO)
  const status = useAudioPlayerStatus(player)

  useEffect(() => {
    // terminou: volta ao começo, pronto para ouvir de novo
    if (status.didJustFinish) player.seekTo(0)
  }, [status.didJustFinish, player])

  return (
    <AudioPlayer
      label="Mensagem de voz"
      playing={status.playing}
      position={status.currentTime}
      duration={status.duration}
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
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted, oldMuted: player.muted })
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const done = player.addListener('playToEnd', () => {
      player.currentTime = 0
    })
    return () => done.remove()
  }, [player])

  return (
    <VideoPlayer
      label="Vídeo enviado pelo cliente"
      playing={isPlaying}
      position={currentTime}
      duration={player.duration}
      muted={muted}
      fullscreen={fullscreen}
      onPlayPause={() => (isPlaying ? player.pause() : player.play())}
      onSeek={(seconds) => {
        player.currentTime = seconds
      }}
      onToggleMute={() => {
        player.muted = !player.muted
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
      <Audio />
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
