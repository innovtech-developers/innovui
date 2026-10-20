/// <reference types="uniwind/types" />

import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { cn } from '../../utils/cn'
import { CheckIcon, CloseIcon } from '../_shared/status'
import { useToken } from '../_shared/use-token'

export type UploadFileStatus = 'uploading' | 'done' | 'error'

export type UploadFile = {
  /** Identificador estável do arquivo; volta em `onRemoveFile`. */
  id: string
  name: string
  /** Tamanho em bytes; sem ele, nada é mostrado. */
  size?: number
  /** `uploading` mostra a barra de progresso; `done` e `error` mostram o resultado. */
  status?: UploadFileStatus
  /** Progresso de 0 a 100, só para `uploading`. Sem ele, a barra fica em 0. */
  progress?: number
  /** Texto do erro, mostrado no lugar do tamanho quando `status="error"`. */
  errorMessage?: string
}

export type UploadProps = {
  /**
   * Chamado ao tocar na área. O componente não escolhe arquivos: abra o seletor que preferir e
   * guarde o resultado no estado que alimenta `files`. Com expo-document-picker:
   *
   *   import * as DocumentPicker from 'expo-document-picker'
   *
   *   async function pick() {
   *     const result = await DocumentPicker.getDocumentAsync({ multiple: true })
   *     if (result.canceled) return
   *     setFiles((prev) => [
   *       ...prev,
   *       ...result.assets.map((a) => ({
   *         id: a.uri,
   *         name: a.name,
   *         size: a.size,
   *         status: 'uploading' as const,
   *       })),
   *     ])
   *   }
   *   <Upload onPick={pick} files={files} onRemoveFile={(id) => setFiles(...)} />
   */
  onPick: () => void
  /** Arquivos já escolhidos, listados abaixo da área com tamanho, status e botão de remover. */
  files?: UploadFile[]
  /** Chamado ao tocar no × de um arquivo. Sem ele, o botão não aparece. */
  onRemoveFile?: (id: string) => void
  /** Texto principal da área. */
  title?: ReactNode
  /** Texto de apoio (formatos e tamanho aceitos, por exemplo). */
  description?: ReactNode
  /** Borda em vermelho, para quando os arquivos escolhidos têm problema. */
  error?: boolean
  disabled?: boolean
  /** Prefixo do rótulo acessível do botão de remover ("Remover contrato.pdf"). */
  removeLabel?: string
  className?: string
  accessibilityLabel?: string
  testID?: string
}

/** "1,5 MB", "230 KB", "12 B". */
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  const mb = kb / 1024
  return `${(mb < 10 ? Math.round(mb * 10) / 10 : Math.round(mb)).toString().replace('.', ',')} MB`
}

function UploadIcon({ color }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
      />
    </Svg>
  )
}

function FileRow({
  file,
  onRemove,
  removeLabel,
}: {
  file: UploadFile
  onRemove?: (id: string) => void
  removeLabel: string
}) {
  const successColor = useToken('--color-status-success-text')
  const iconColor = useToken('--color-text-secondary')
  const progress = Math.min(100, Math.max(0, file.progress ?? 0))
  const isError = file.status === 'error'
  const detail = isError && file.errorMessage ? file.errorMessage : undefined
  const size = file.size === undefined ? undefined : formatSize(file.size)

  return (
    <View
      className={cn(
        'gap-2 rounded-md border bg-field-bg px-3 py-2',
        isError ? 'border-field-border-error' : 'border-field-border',
      )}
    >
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Text numberOfLines={1} className="text-sm font-medium text-text-primary">
            {file.name}
          </Text>
          {detail || size ? (
            <Text
              className={cn('text-xs', isError ? 'text-status-error-text' : 'text-text-secondary')}
            >
              {detail ?? size}
            </Text>
          ) : null}
        </View>
        {file.status === 'done' ? (
          <View accessible accessibilityLabel="Concluído">
            <CheckIcon color={successColor} />
          </View>
        ) : null}
        {onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${removeLabel} ${file.name}`}
            hitSlop={8}
            onPress={() => onRemove(file.id)}
            className="size-8 items-center justify-center rounded-full active:bg-bg-tertiary"
          >
            <CloseIcon color={iconColor} />
          </Pressable>
        ) : null}
      </View>
      {file.status === 'uploading' ? (
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={file.name}
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          className="h-1 overflow-hidden rounded-full bg-bg-tertiary"
        >
          <View
            className="h-full rounded-full bg-interactive-primary"
            style={{ width: `${progress}%` }}
          />
        </View>
      ) : null}
    </View>
  )
}

/**
 * Área para escolher arquivos tocando, mais a lista dos escolhidos. No native não há dropzone nem
 * `<input type="file">`, e o seletor depende do app (expo-document-picker, image-picker...): por
 * isso o componente é controlado e agnóstico. `onPick` abre o seu seletor; `files` e
 * `onRemoveFile` descrevem a lista. Validar tipo e tamanho e enviar ao servidor ficam com você.
 */
export function Upload({
  onPick,
  files,
  onRemoveFile,
  title = 'Toque para escolher arquivos',
  description,
  error,
  disabled,
  removeLabel = 'Remover',
  className,
  accessibilityLabel,
  testID,
}: UploadProps) {
  const iconColor = useToken('--color-text-secondary')

  return (
    <View className="gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ??
          (typeof title === 'string' && typeof description === 'string'
            ? `${title}. ${description}`
            : typeof title === 'string'
              ? title
              : undefined)
        }
        accessibilityState={{ disabled: Boolean(disabled) }}
        disabled={disabled}
        onPress={onPick}
        testID={testID}
        className={cn(
          'items-center gap-1 rounded-md border border-dashed bg-field-bg px-6 py-8',
          error ? 'border-field-border-error' : 'border-field-border',
          'active:border-interactive-primary active:bg-button-secondary-bg',
          'disabled:border-field-border-disabled disabled:bg-field-bg-disabled',
          className,
        )}
      >
        <View className="mb-1">
          <UploadIcon color={iconColor} />
        </View>
        <Text
          className={cn(
            'text-center text-sm font-medium text-text-primary',
            disabled && 'text-field-text-disabled',
          )}
        >
          {title}
        </Text>
        {description ? (
          <Text
            className={cn(
              'text-center text-xs text-text-secondary',
              disabled && 'text-field-text-disabled',
            )}
          >
            {description}
          </Text>
        ) : null}
      </Pressable>
      {files && files.length > 0 ? (
        <View className="gap-2">
          {files.map((file) => (
            <FileRow key={file.id} file={file} onRemove={onRemoveFile} removeLabel={removeLabel} />
          ))}
        </View>
      ) : null}
    </View>
  )
}
