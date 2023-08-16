import { createRoot } from 'react-dom/client'
import refreshOnUpdate from 'virtual:reload-on-update-in-view'
import App from './app'

refreshOnUpdate('pages/content')

const root = document.createElement('div')
root.id = 'sem-nav-extension-root'
document.body.append(root)
createRoot(root).render(<App />)
