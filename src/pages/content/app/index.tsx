import { createRoot } from 'react-dom/client'
import refreshOnUpdate from 'virtual:reload-on-update-in-view'
import App from './app'
import { initSemUI } from './semUI'
import { getElement } from '@src/shared/getElement'

refreshOnUpdate('pages/content')

async function initApp() {
  // Waiting for the body to appear
  const body = await getElement(() => document.body)
  const root = document.createElement('div')
  root.id = 'snav-extension-root'
  body.append(root)
  createRoot(root).render(<App />)

  // Apply custom styles
  initSemUI()
}

initApp()
