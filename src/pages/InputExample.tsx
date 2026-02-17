import { createSignal } from 'solid-js'
import TextInput from '../components/TextInput'

export default function InputExample() {
  const [name, setName] = createSignal('')

  return (
    <div class="input-example">
      <h1>Input Example</h1>
      <TextInput label="Your name" value={name()} onChange={setName} placeholder="Type a name" />
      <p>Current value: {name() || <em>(empty)</em>}</p>
    </div>
  )
}
