import { createRoot } from 'react-dom/client'
import refreshOnUpdate from 'virtual:reload-on-update-in-view'
import App from './app'
import { initSemUI } from './semUI'

refreshOnUpdate('pages/content')

const root = document.createElement('div')
root.id = 'snav-extension-root'
document.body.append(root)
createRoot(root).render(<App />)

initSemUI()
