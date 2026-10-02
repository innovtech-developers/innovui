import { Button, type ButtonProps } from '@innovui/react'
import { useState } from 'react'

type Variant = NonNullable<ButtonProps['variant']>
type Size = NonNullable<ButtonProps['size']>

const VARIANT_TOKENS: Record<Variant, { swatch: string; token: string }> = {
  primary: { swatch: '#9035ee', token: 'button/primary/bg' },
  secondary: { swatch: '#faf5ff', token: 'button/secondary/bg' },
  tertiary: { swatch: '#10172b', token: 'button/tertiary/text' },
  ghost: { swatch: '#9035ee', token: 'button/ghost/text' },
  destructive: { swatch: '#d3221e', token: 'button/destructive/bg' },
}

/** Quebra o nome do token em "/" para não precisar de overflow-wrap:anywhere (que corta palavras ao meio). */
function TokenName({ token }: { token: string }) {
  return (
    <>
      {token.split('/').map((part, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: lista estática, nunca reordena
        <span key={i}>
          {i > 0 && <wbr />}
          {i > 0 && '/'}
          {part}
        </span>
      ))}
    </>
  )
}

const SIZE_TOKENS: Record<Size, { height: number }> = {
  lg: { height: 56 },
  md: { height: 44 },
  sm: { height: 36 },
}

const VARIANTS: Variant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'destructive']
const SIZES: Size[] = ['lg', 'md', 'sm']

/**
 * A prancha de espécime do hero: o Button real, montado, com rótulo de coleta
 * e leitura de medidas ao vivo — a interação de assinatura herdada do type specimen.
 */
export function SpecimenPlate() {
  const [variant, setVariant] = useState<Variant>('primary')
  const [size, setSize] = useState<Size>('md')
  const tokens = VARIANT_TOKENS[variant]
  const height = SIZE_TOKENS[size].height

  return (
    <div className="specimen-plate">
      <span className="specimen-plate__tape specimen-plate__tape--tl" aria-hidden="true" />
      <span className="specimen-plate__tape specimen-plate__tape--br" aria-hidden="true" />

      <span className="specimen-plate__stamp">Comhub DS v2.1 · coletado ago/2026</span>

      <div className="specimen-plate__mount">
        <Button variant={variant} size={size}>
          {variant === 'destructive' ? 'Excluir projeto' : 'Salvar alterações'}
        </Button>
      </div>

      <dl className="specimen-plate__reading">
        <div>
          <dt>Nome</dt>
          <dd>Button</dd>
        </div>
        <div>
          <dt>Variante</dt>
          <dd>{variant}</dd>
        </div>
        <div>
          <dt>Tamanho</dt>
          <dd>
            {size} · {height}px
          </dd>
        </div>
        <div>
          <dt>Token</dt>
          <dd>
            <TokenName token={tokens.token} />
          </dd>
        </div>
        <div>
          <dt>Cor</dt>
          <dd className="specimen-plate__swatch">
            <span
              className="specimen-plate__swatch-chip"
              style={{ backgroundColor: tokens.swatch }}
              aria-hidden="true"
            />
            {tokens.swatch}
          </dd>
        </div>
      </dl>

      <div className="specimen-plate__controls">
        <fieldset className="specimen-plate__control-row">
          <legend>Variante</legend>
          {VARIANTS.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={v === variant}
              className="specimen-plate__chip"
              onClick={() => setVariant(v)}
            >
              {v}
            </button>
          ))}
        </fieldset>
        <fieldset className="specimen-plate__control-row">
          <legend>Tamanho</legend>
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === size}
              className="specimen-plate__chip"
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </fieldset>
      </div>
    </div>
  )
}
