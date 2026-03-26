import { createSignal, Show } from 'solid-js'
import TextInput from '../components/TextInput'

export default function InputExample() {
  const [email, setEmail] = createSignal('')
  const [touched, setTouched] = createSignal(false)
  const [submitted, setSubmitted] = createSignal(false)

  const emailError = () => {
    if (!touched() && !submitted()) return ''
    if (!email()) return 'Email is required.'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email())) return 'Please enter a valid email address.'
    return ''
  }

  function onBlur() {
    setTouched(true)
  }

  function onSubmit(e: Event) {
    e.preventDefault()
    setSubmitted(true)
    setTouched(true)
    if (!emailError()) {
      alert(`Submitted: ${email()}`)
      console.log('Submitted:', email())
    }
  }

  return (
    <div class="input-example">
      <h1>Email Input Example (Solid)</h1>

      <form onSubmit={onSubmit}>
        <TextInput label="Email" type="email" value={email()} onChange={setEmail} onBlur={onBlur} placeholder="you@example.com" />

        <div class="validation">
          <Show when={emailError()} fallback={null}>
            <small class="error">{emailError()}</small>
          </Show>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
