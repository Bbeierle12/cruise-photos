import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx loaded')
console.log('Root element:', document.getElementById('root'))

const rootElement = document.getElementById('root')

if (rootElement) {
  try {
    const root = createRoot(rootElement)
    console.log('Root created, attempting render...')
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log('Render called')
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;"><h1>Error</h1><pre>${error.message}\n${error.stack}</pre></div>`
  }
} else {
  console.error('Root element not found!')
}
