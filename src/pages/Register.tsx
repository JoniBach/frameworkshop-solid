import { createSignal, Show } from 'solid-js'
import TextInput from '../components/TextInput'

type RegisteredUser = {
  id: string
  email: string
  createdAt: string
}

export default function Register() {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [touchedEmail, setTouchedEmail] = createSignal(false)
  const [touchedPassword, setTouchedPassword] = createSignal(false)
  const [touchedConfirmPassword, setTouchedConfirmPassword] = createSignal(false)
  const [submitted, setSubmitted] = createSignal(false)
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [registeredUser, setRegisteredUser] = createSignal<RegisteredUser | null>(null)
  const [error, setError] = createSignal<string | null>(null)

  const emailError = () => {
    if (!touchedEmail() && !submitted()) return ''
    if (!email()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email())) return 'Please enter a valid email address.'
    return ''
  }

  const passwordError = () => {
    if (!touchedPassword() && !submitted()) return ''
    if (!password()) return 'Password is required.'
    if (password().length < 9) return 'Password must be at least 9 characters.'
    return ''
  }

  const confirmPasswordError = () => {
    if (!touchedConfirmPassword() && !submitted()) return ''
    if (!confirmPassword()) return 'Please confirm your password.'
    if (confirmPassword() !== password()) return 'Passwords must match.'
    return ''
  }

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setSubmitted(true)
    setTouchedEmail(true)
    setTouchedPassword(true)
    setTouchedConfirmPassword(true)

    if (emailError() || passwordError() || confirmPasswordError()) return

    try {
      setIsSubmitting(true)
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email(), password: password() }),
      })

      const result = await response.json().catch(() => ({ error: 'unknown' }))

      if (!response.ok) {
        throw new Error(result.error || `Server responded ${response.status}`)
      }

      setRegisteredUser(result.user)
      setError(null)
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Error registering user', err)
      setRegisteredUser(null)
      setError((err as Error).message)
      setPassword('')
      setConfirmPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="input-example">
      <h1>Register</h1>

      <p>Create a user by sending an email and password to the Deno backend. The backend hashes the password before storing it in Deno KV.</p>

      <Show when={error()} fallback={null}>
        <p class="error">Registration failed: {error()}</p>
      </Show>

      <Show when={registeredUser()} fallback={null}>
        <div>
          <h2>Registered user</h2>
          <p><strong>Email:</strong> {registeredUser()?.email}</p>
          <p><small>Created at {new Date(registeredUser()?.createdAt || '').toLocaleTimeString()}</small></p>
        </div>
      </Show>

      <form onSubmit={onSubmit}>
        <TextInput label="Email" type="email" value={email()} onChange={setEmail} onBlur={() => setTouchedEmail(true)} placeholder="you@example.com" />
        <div class="validation">
          <Show when={emailError()} fallback={null}>
            <small class="error">{emailError()}</small>
          </Show>
        </div>

        <TextInput label="Password" type="password" value={password()} onChange={setPassword} onBlur={() => setTouchedPassword(true)} placeholder="At least 9 characters" showClear={false} />
        <div class="validation">
          <Show when={passwordError()} fallback={null}>
            <small class="error">{passwordError()}</small>
          </Show>
        </div>

        <TextInput label="Confirm password" type="password" value={confirmPassword()} onChange={setConfirmPassword} onBlur={() => setTouchedConfirmPassword(true)} placeholder="Repeat password" showClear={false} />
        <div class="validation">
          <Show when={confirmPasswordError()} fallback={null}>
            <small class="error">{confirmPasswordError()}</small>
          </Show>
        </div>

        <button type="submit" disabled={isSubmitting()}>Register</button>
      </form>
    </div>
  )
}
