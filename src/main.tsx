import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { openApply } from './lib/links'
import './styles/global.css'
import { loadTexts } from './lib/texts'

// texts edited in Panel Klubu → „Strona”
loadTexts()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// old shared links to the form (/#aplikuj, /#aplikacja …) now open the pop-up
if (['#aplikuj', '#aplikuj-form', '#aplikacja', '#aplikacja-form'].includes(window.location.hash)) {
  history.replaceState(null, '', window.location.pathname)
  setTimeout(openApply, 300)
}
