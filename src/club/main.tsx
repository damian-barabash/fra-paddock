import React from 'react'
import ReactDOM from 'react-dom/client'
import ClubApp from './ClubApp'
import ErrorBoundary from './ErrorBoundary'
import '../styles/global.css'
import './club.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClubApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
