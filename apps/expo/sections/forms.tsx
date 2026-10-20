import {
  Checkbox,
  Combobox,
  DatePicker,
  DateRangePicker,
  Field,
  Input,
  Radio,
  SegmentedControl,
  SegmentedItem,
  Select,
  SelectOption,
  Slider,
  Switch,
  Textarea,
  Upload,
} from '@innovui/react-native'
import { useState } from 'react'
import { Section } from './section'

const frutas = [
  { value: 'maca', label: 'Maçã' },
  { value: 'banana', label: 'Banana' },
  { value: 'uva', label: 'Uva' },
]

export function Forms() {
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState('a')
  const [on, setOn] = useState(true)
  const [slider, setSlider] = useState([40])
  const [seg, setSeg] = useState('dia')
  const [files, setFiles] = useState<{ id: string; name: string; size: number }[]>([])

  return (
    <>
      <Section title="Campos">
        <Field label="Nome" supportingText="Como aparece no seu perfil">
          <Input placeholder="Seu nome" />
        </Field>
        <Field label="E-mail" error supportingText="E-mail inválido" required>
          <Input placeholder="voce@exemplo.com" keyboardType="email-address" />
        </Field>
        <Field label="Mensagem">
          <Textarea placeholder="Escreva aqui" />
        </Field>
        <Select placeholder="Escolha uma fruta" accessibilityLabel="Fruta">
          <SelectOption value="maca">Maçã</SelectOption>
          <SelectOption value="banana">Banana</SelectOption>
          <SelectOption value="uva" disabled>
            Uva (indisponível)
          </SelectOption>
        </Select>
        <Combobox options={frutas} placeholder="Busque uma fruta" accessibilityLabel="Fruta" />
      </Section>
      <Section title="Seleção">
        <Checkbox label="Aceito os termos" checked={checked} onCheckedChange={setChecked} />
        <Checkbox label="Parcial" indeterminate />
        <Radio label="Opção A" checked={radio === 'a'} onCheckedChange={() => setRadio('a')} />
        <Radio label="Opção B" checked={radio === 'b'} onCheckedChange={() => setRadio('b')} />
        <Switch label="Notificações" checked={on} onCheckedChange={setOn} />
        <Slider value={slider} onValueChange={setSlider} accessibilityLabel="Volume" />
        <SegmentedControl value={seg} onValueChange={setSeg} accessibilityLabel="Período">
          <SegmentedItem value="dia">Dia</SegmentedItem>
          <SegmentedItem value="semana">Semana</SegmentedItem>
          <SegmentedItem value="mes">Mês</SegmentedItem>
        </SegmentedControl>
      </Section>
      <Section title="Datas e upload">
        <DatePicker accessibilityLabel="Data" />
        <DateRangePicker accessibilityLabel="Período" />
        <Upload
          files={files}
          onRemoveFile={(id) => setFiles((f) => f.filter((x) => x.id !== id))}
          onPick={() =>
            setFiles((f) => [
              ...f,
              { id: String(f.length + 1), name: `arquivo-${f.length + 1}.pdf`, size: 120_000 },
            ])
          }
        />
      </Section>
    </>
  )
}
