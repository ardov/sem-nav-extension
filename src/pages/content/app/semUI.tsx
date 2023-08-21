import { settings } from '@src/model/userSettings'

// Class names
const hideFooter = 'snav-hide-footer'
const hideSidebar = 'snav-hide-sidebar'
const zenMode = 'snav-zen-mode'

const styleToInject = `
.${hideFooter} .srf-layout__footer {
  display: none;
}

.${hideSidebar} srf-layout__sidebar {
  display: none;
}

.${zenMode} .srf-layout__footer,
.${zenMode} .srf-layout__sidebar,
.${zenMode} .srf-layout__search-panel,
.${zenMode} .srf-layout__header {
  display: none;
}
.${zenMode} .srf-layout__body {
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
}

body {
  background-color: #f4f5f9
}
`

export const initSemUI = () => {
  const injectedStyle = document.createElement('style')
  injectedStyle.innerHTML = styleToInject
  document.head.append(injectedStyle)

  settings.store.listen(store => {
    if (store.zenMode) document.body.classList.add(zenMode)
    else document.body.classList.remove(zenMode)

    if (store.showFooter) document.body.classList.remove(hideFooter)
    else document.body.classList.add(hideFooter)

    if (store.showMenu) document.body.classList.remove(hideSidebar)
    else document.body.classList.add(hideSidebar)
  })
}
