import React from 'react'
import ReactDOM from 'react-dom/client'
import ClubApp from './ClubApp'
import '../styles/global.css'
import './club.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClubApp />
  </React.StrictMode>,
)
