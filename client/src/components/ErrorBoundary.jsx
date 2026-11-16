import { Component } from 'react';
import { useLocation } from 'react-router-dom';

const RELOAD_KEY = 'esr_chunk_reload_at';
const isChunkError = (e) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\w-]+ failed|ChunkLoadError/i.test(
    `${e?.name || ''} ${e?.message || ''}`
  );

// Catches render/lazy-load errors so a single failure never blanks the whole site.
class Boundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
    // A deployment replaced the JS chunks this (cached) page points to: reload once to pick up the new build.
    if (isChunkError(error)) {
      try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
        if (Date.now() - last > 15000) {
          sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
          window.location.reload();
        }
      } catch {
        /* storage unavailable */
      }
    }
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', padding: '24px', textAlign: 'center', color: '#4a2b20' }}>
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontSize: 44 }}>🍫</div>
          <h2 style={{ margin: '8px 0', fontSize: 20, fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#765044' }}>This page couldn't be displayed. Please try again or go back to the home page.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => window.location.reload()} style={{ padding: '10px 18px', borderRadius: 12, background: '#321b15', color: '#fff', fontWeight: 700, fontSize: 14 }}>Reload page</button>
            <a href="/" style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid #9b765e', color: '#70412e', fontWeight: 700, fontSize: 14 }}>Go to home</a>
          </div>
        </div>
      </div>
    );
  }
}

// Resets automatically when the user navigates to another route.
export default function ErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <Boundary resetKey={pathname}>{children}</Boundary>;
}
