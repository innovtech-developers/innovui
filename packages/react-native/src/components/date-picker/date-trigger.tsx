import { FieldTrigger, type FieldTriggerProps } from '../select/field-trigger'

export type DateTriggerProps = Omit<FieldTriggerProps, 'icon'>

/** Gatilho no estilo do Input que mostra a data e abre o calendário (não faz parte da API pública). */
export function DateTrigger(props: DateTriggerProps) {
  return <FieldTrigger {...props} icon="calendar" />
}
