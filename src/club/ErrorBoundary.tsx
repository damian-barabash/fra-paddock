import { Component, type ReactNode } from 'react'
import { asset } from '../lib/asset'
import { CONTACT_EMAIL } from '../content'

/** Never leave a member on a blank screen: show a calm message with a way out. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.error('[klub]', error)
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="auth">
        <div className="auth-card">
          <img className="auth-logo" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          <h1>Chwilowy problem</h1>
          <p className="auth-lead">
            Nie udało się wczytać Strefy Członka. Odśwież stronę — jeśli to nie pomoże, napisz na{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <button type="button" className="btn btn-gold" onClick={() => window.location.reload()}>Odśwież</button>
        </div>
      </div>
    )
  }
}
