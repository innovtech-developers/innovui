import { Checkbox, Field, Input, Radio, Switch, Textarea } from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

export function InputSizesDemo() {
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 320 }}>
        <Input size="lg" placeholder="Large" />
        <Input size="md" placeholder="Medium" />
        <Input size="sm" placeholder="Small" />
      </div>
    </Stage>
  )
}

export function InputStatesDemo() {
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 320 }}>
        <Input placeholder="Default" />
        <Input defaultValue="email@invalido" error />
        <Input placeholder="Disabled" disabled />
        <Input defaultValue="Não editável" readOnly />
      </div>
    </Stage>
  )
}

export function FieldDemo() {
  const [value, setValue] = useState('')
  const error = value.length > 0 && !value.includes('@')

  return (
    <Stage>
      <div style={{ maxWidth: 320 }}>
        <Field
          label="E-mail"
          required
          error={error}
          supportingText={error ? 'Formato de e-mail inválido.' : 'Usaremos para enviar o acesso.'}
        >
          <Input
            placeholder="voce@empresa.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
      </div>
    </Stage>
  )
}

export function TextareaDemo() {
  return (
    <Stage>
      <div style={{ maxWidth: 400 }}>
        <Field label="Descrição" supportingText="Máximo de 500 caracteres.">
          <Textarea placeholder="Descreva com detalhes…" maxLength={500} />
        </Field>
      </div>
    </Stage>
  )
}

export function CheckboxDemo() {
  const options = ['Notificações por e-mail', 'Notificações push', 'Resumo semanal']
  const [checked, setChecked] = useState<boolean[]>([true, false, false])
  const allChecked = checked.every(Boolean)
  const someChecked = checked.some(Boolean)

  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Checkbox
          label="Selecionar todos"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(e) => setChecked(checked.map(() => e.target.checked))}
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.5rem' }}
        >
          {options.map((label, i) => (
            <Checkbox
              key={label}
              label={label}
              checked={checked[i]}
              onChange={(e) =>
                setChecked(checked.map((c, idx) => (idx === i ? e.target.checked : c)))
              }
            />
          ))}
        </div>
      </div>
    </Stage>
  )
}

export function RadioDemo() {
  const [plan, setPlan] = useState('mensal')
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          ['mensal', 'Mensal'],
          ['trimestral', 'Trimestral'],
          ['anual', 'Anual'],
        ].map(([value, label]) => (
          <Radio
            key={value}
            name="plano"
            label={label}
            checked={plan === value}
            onChange={() => setPlan(value)}
          />
        ))}
      </div>
    </Stage>
  )
}

export function SwitchDemo() {
  const [dark, setDark] = useState(false)
  return (
    <Stage>
      <Switch label="Modo escuro" checked={dark} onChange={(e) => setDark(e.target.checked)} />
    </Stage>
  )
}
