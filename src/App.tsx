import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import Comp from './Comp';
import InputExample from './pages/InputExample';

const App: Component = () => {
  const [path, setPath] = createSignal(window.location.pathname);

  function navigate(to: string) {
    if (to !== window.location.pathname) {
      history.pushState({}, '', to);
      setPath(to);
    }
  }

  onMount(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', 'justify-content': 'center' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/input-example'); }}>Input Example</a>
      </nav>

      <main>
        {path() === '/' && (
          <>
            <h1>Hello world!!!!</h1>
            <Comp />
          </>
        )}

        {path() === '/input-example' && <InputExample />}
      </main>
    </div>
  );
};

export default App;
