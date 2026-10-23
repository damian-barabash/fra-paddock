import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

// old links to sections that moved to /aplikacja (e.g. shared /#aplikuj) keep working
const moved: Record<string, string> = {
  '#aplikuj': '#aplikacja',
  '#aplikuj-form': '#aplikacja',
  '#zasady': '#zasady',
  '#sciezka': '#sciezka',
  '#program': '#program',
}
const target = moved[window.location.hash]
if (target) {
  window.location.replace(`aplikacja/${target}`)
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
