import {
  Calendar,
  Combobox,
  DatePicker,
  type DateRange,
  DateRangePicker,
  Field,
  getDatePresets,
  List,
  ListItem,
  Slider,
  Stack,
  Upload,
} from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

const estados = [
  ['AC', 'Acre'],
  ['AL', 'Alagoas'],
  ['AP', 'Amapá'],
  ['AM', 'Amazonas'],
  ['BA', 'Bahia'],
  ['CE', 'Ceará'],
  ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'],
  ['GO', 'Goiás'],
  ['MA', 'Maranhão'],
  ['MT', 'Mato Grosso'],
  ['MS', 'Mato Grosso do Sul'],
  ['MG', 'Minas Gerais'],
  ['PA', 'Pará'],
  ['PB', 'Paraíba'],
  ['PR', 'Paraná'],
  ['PE', 'Pernambuco'],
  ['PI', 'Piauí'],
  ['RJ', 'Rio de Janeiro'],
  ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'],
  ['RO', 'Rondônia'],
  ['RR', 'Roraima'],
  ['SC', 'Santa Catarina'],
  ['SP', 'São Paulo'],
  ['SE', 'Sergipe'],
  ['TO', 'Tocantins'],
].map(([value, label]) => ({ value: value as string, label: label as string }))

const box = { maxWidth: 360 } as const

export function ComboboxDemo() {
  return (
    <Stage>
      <div style={box}>
        <Field label="Estado" supportingText="Digite para buscar, ex.: “sao”">
          <Combobox options={estados} placeholder="Escolha um estado" />
        </Field>
      </div>
    </Stage>
  )
}

export function ComboboxStatesDemo() {
  return (
    <Stage>
      <Stack gap={4} style={box}>
        <Field label="Com valor" size="sm">
          <Combobox options={estados} defaultValue="SP" />
        </Field>
        <Field label="Com erro" error supportingText="Escolha um estado da lista">
          <Combobox options={estados} />
        </Field>
        <Field label="Desabilitado" disabled>
          <Combobox options={estados} defaultValue="RJ" />
        </Field>
      </Stack>
    </Stage>
  )
}

export function SliderDemo() {
  const [value, setValue] = useState([40])
  return (
    <Stage>
      <Stack gap={3} style={box}>
        <span style={{ color: 'var(--color-text-secondary)' }}>Volume: {value[0]}%</span>
        <Slider aria-label="Volume" value={value} onValueChange={setValue} max={100} step={1} />
      </Stack>
    </Stage>
  )
}

export function SliderRangeDemo() {
  const [range, setRange] = useState([200, 800])
  return (
    <Stage>
      <Stack gap={3} style={box}>
        <span style={{ color: 'var(--color-text-secondary)' }}>
          Preço: R$ {range[0]} a R$ {range[1]}
        </span>
        <Slider
          aria-label="Preço"
          thumbLabels={['Preço mínimo', 'Preço máximo']}
          value={range}
          onValueChange={setRange}
          min={0}
          max={1000}
          step={10}
        />
      </Stack>
    </Stage>
  )
}

export function SliderDisabledDemo() {
  return (
    <Stage>
      <div style={box}>
        <Slider aria-label="Volume (bloqueado)" defaultValue={[60]} disabled />
      </div>
    </Stage>
  )
}

const bytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.ceil(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`

export function UploadDemo() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <Stage>
      <Stack gap={3} style={{ maxWidth: 480 }}>
        <Upload
          multiple
          accept=".pdf,image/*"
          description="PDF ou imagem, até 5 MB"
          aria-label="Anexos"
          onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
        />
        {files.length > 0 && (
          <List divided>
            {files.map((file, i) => (
              <ListItem
                // biome-ignore lint/suspicious/noArrayIndexKey: o mesmo arquivo pode ser escolhido duas vezes
                key={`${file.name}-${i}`}
                title={file.name}
                description={bytes(file.size)}
              />
            ))}
          </List>
        )}
      </Stack>
    </Stage>
  )
}

export function DatePickerDemo() {
  return (
    <Stage>
      <div style={{ maxWidth: 280 }}>
        <Field label="Data de entrega" supportingText="Escolha um dia">
          <DatePicker />
        </Field>
      </div>
    </Stage>
  )
}

export function DatePickerLimitsDemo() {
  const today = new Date()
  const limit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)
  return (
    <Stage>
      <div style={{ maxWidth: 280 }}>
        <Field label="Agendar para" supportingText="De hoje até 30 dias à frente">
          <DatePicker minDate={today} maxDate={limit} weekStartsOn={1} />
        </Field>
      </div>
    </Stage>
  )
}

export function DateRangePickerDemo() {
  return (
    <Stage>
      <div style={{ maxWidth: 320 }}>
        <Field label="Período da hospedagem" supportingText="Escolha a entrada e depois a saída">
          <DateRangePicker />
        </Field>
      </div>
    </Stage>
  )
}

export function DateRangePresetsDemo() {
  return (
    <Stage>
      <div style={{ maxWidth: 320 }}>
        <Field label="Relatório" supportingText="Use um atalho ou escolha os dois dias">
          <DateRangePicker presets defaultValue={getDatePresets()[1]?.range} />
        </Field>
      </div>
    </Stage>
  )
}

export function CalendarRangeDemo() {
  const [range, setRange] = useState<DateRange>({})
  const format = new Intl.DateTimeFormat('pt-BR')
  return (
    <Stage>
      <Stack gap={3}>
        <Calendar mode="range" value={range} onValueChange={setRange} />
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {range.from
            ? `${format.format(range.from)} até ${range.to ? format.format(range.to) : '…'}`
            : 'Nenhum período escolhido'}
        </span>
      </Stack>
    </Stage>
  )
}

export function CalendarDemo() {
  return (
    <Stage>
      <Calendar />
    </Stage>
  )
}
