import type { Component } from 'solid-js'

type Props = {
  label?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  type?: string
  placeholder?: string
  showClear?: boolean
}

const TextInput: Component<Props> = props => {
  const onInput = (e: InputEvent) => {
    const v = (e.target as HTMLInputElement).value
    props.onChange(v)
  }

  const onBlur = () => {
    props.onBlur && props.onBlur()
  }

  return (
    <div class="text-input">
      {props.label && <label class="text-input__label">{props.label}</label>}
      <div class="text-input__row">
        <input
          class="text-input__field"
          value={props.value}
          type={props.type ?? 'text'}
          onInput={onInput}
          onBlur={onBlur}
          placeholder={props.placeholder}
        />
        {props.showClear !== false && props.value && (
          <button
            type="button"
            class="text-input__clear"
            onClick={() => props.onChange('')}
            aria-label="Clear input"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default TextInput
