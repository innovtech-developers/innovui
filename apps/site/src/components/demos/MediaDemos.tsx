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
} from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

const photos = [
  { src: '/media/foto-1.jpg', alt: 'Estrada sinuosa entre montanhas vulcânicas' },
  { src: '/media/foto-2.jpg', alt: 'Via Láctea sobre um lago' },
  { src: '/media/foto-3.jpg', alt: 'Chá e livro ao sol' },
  { src: '/media/foto-4.jpg', alt: 'Ondas do mar vistas de cima' },
  { src: '/media/foto-5.jpg', alt: 'Montanhas nevadas sob céu azul' },
  { src: '/media/foto-6.jpg', alt: 'Viaduto de pedra sobre a floresta' },
].map((photo, i) => ({ ...photo, thumbSrc: `/media/foto-${i + 1}-p.jpg` }))

const templates = [
  {
    photo: photos[1],
    title: 'Mensagem de boas-vindas',
    text: 'Primeiro contato com o cliente: apresentação da empresa, horário de atendimento e os próximos passos da conversa.',
  },
  {
    photo: photos[4],
    title: 'Catálogo de produtos',
    text: 'Envio do catálogo com foto, descrição e preço de cada item, pronto para o cliente escolher e responder na conversa.',
  },
  {
    photo: photos[0],
    title: 'Confirmação de pedido',
    text: 'Confirme os itens, o pagamento e o prazo de entrega para o cliente acompanhar o pedido.',
  },
  {
    photo: photos[3],
    title: 'Mensagem de pós-venda',
    text: 'Saiba como foi a experiência do cliente e ofereça ajuda após a compra.',
  },
]

export function AudioPlayerDemo() {
  return (
    <Stage>
      <AudioPlayer src="/media/audio-exemplo.m4a" label="Mensagem de voz" />
    </Stage>
  )
}

export function AudioPlayerSpeedsDemo() {
  return (
    <Stage>
      <AudioPlayer
        src="/media/audio-exemplo.m4a"
        label="Mensagem de voz"
        speeds={[0.75, 1, 1.25, 1.5]}
      />
    </Stage>
  )
}

export function VideoPlayerDemo() {
  return (
    <Stage>
      <VideoPlayer src="/media/video-exemplo.mp4" label="Vídeo enviado pelo cliente" />
    </Stage>
  )
}

export function GalleryDemo() {
  return (
    <Stage>
      <Gallery items={photos} aria-label="Anexos da conversa" />
    </Stage>
  )
}

export function LightboxDemo() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  return (
    <Stage>
      <Button
        onClick={() => {
          setIndex(0)
          setOpen(true)
        }}
      >
        Ver fotos
      </Button>
      <Lightbox
        items={photos}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </Stage>
  )
}

export function CarouselDemo() {
  return (
    <Stage>
      <Carousel label="Modelos de mensagem">
        {templates.map(({ photo, title, text }) => (
          <CarouselItem key={title}>
            <Card padding="none" className="iu:overflow-hidden" style={{ height: '100%' }}>
              <img
                src={photo.src}
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  objectFit: 'cover',
                }}
              />
              <Stack gap={2} align="start" className="iu:p-4">
                <strong style={{ fontSize: 18, lineHeight: '24px' }}>{title}</strong>
                <span style={{ color: 'var(--color-text-secondary)' }}>{text}</span>
                <Button variant="ghost">Usar modelo</Button>
              </Stack>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </Stage>
  )
}
