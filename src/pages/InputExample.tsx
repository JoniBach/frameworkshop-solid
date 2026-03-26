import { createSignal, Show, onMount } from 'solid-js'
import TextInput from '../components/TextInput'

type SavedEmail = {
  id: string
  timestamp: string
  input: {
    email: string
  }
}

export default function InputExample() {
  const [email, setEmail] = createSignal('')
  const [touched, setTouched] = createSignal(false)
  const [submitted, setSubmitted] = createSignal(false)
  const [savedEmail, setSavedEmail] = createSignal<SavedEmail | null>(null)
  const [error, setError] = createSignal<string | null>(null)

  const emailError = () => {
    if (!touched() && !submitted()) return ''
    if (!email()) return 'Email is required.'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email())) return 'Please enter a valid email address.'
    return ''
  }

  const fetchEmail = async () => {
    try {
      const res = await fetch('http://localhost:3000/input-example')
      if (!res.ok) throw new Error(`GET failed ${res.status}`)
      const json = (await res.json()) as { status: string; data: SavedEmail | null }
      if (json.status === 'ok' && json.data) {
        setSavedEmail(json.data)
        setEmail(json.data.input.email)
      } else {
        setSavedEmail(null)
      }
      setError(null)
    } catch (err) {
      console.error('Unable to fetch saved email', err)
      setError((err as Error).message)
    }
  }

  onMount(() => {
    fetchEmail()
  })

  const onBlur = () => {
    setTouched(true)
  }

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched(true)

    const err = emailError()
    if (err) {
      console.warn('Validation prevented submit:', err)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/input-example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email() }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'unknown' }))
        throw new Error(`Server responded ${response.status}: ${JSON.stringify(payload)}`)
      }

      const result = await response.json()
      setSavedEmail(result.saved)
      alert(`Saved to Deno KV: ${JSON.stringify(result.saved)}`)
      console.log('Deno API result:', result)

      await fetchEmail()
    } catch (err) {
      console.error('Error saving email to Deno KV', err)
      alert(`Failed to save email to backend: ${(err as Error).message}`)
    }
  }

  return (
    <div class="input-example">
      <h1>Email Input Example (Solid)</h1>

      <div style={{ marginBottom: '16px' }}>
        <h2>Saved email from Deno KV</h2>
        <Show when={error()} fallback={null}>
          <p class="error">Failed to load: {error()}</p>
        </Show>
        <Show when={!error() && !savedEmail()}>
          <p>No saved email yet.</p>
        </Show>
        <Show when={savedEmail()}>
          <p>
            <strong>Saved email:</strong> {savedEmail()?.input.email}
          </p>
          <p>
            <small>Saved at {new Date(savedEmail()?.timestamp || '').toLocaleTimeString()}</small>
          </p>
        </Show>
      </div>

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
