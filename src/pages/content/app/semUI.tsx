import {
  showFooterModel,
  showMenuModel,
  stickySidebarModel,
  zenModeModel,
} from '@src/model/userSettings'

// Class names
const zenMode = 'snav-zen-mode'
const hideFooter = 'snav-hide-footer'
const hideSidebar = 'snav-hide-sidebar'
const stickySidebar = 'snav-sticky-sidebar'

const styleToInject = `
.${hideFooter} .srf-layout__footer {
  display: none;
}

.${hideSidebar} .srf-layout__sidebar {
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

.${stickySidebar} .srf-menu-switcher {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-right: 1px solid #C4C7CF;
  box-sizing: border-box;
}
.${stickySidebar} .srf-menu-switcher::-webkit-scrollbar {
  display: none;
}
.${stickySidebar} .srf-menu-switcher:after {
  border: none;
}

body {
  background-color: #f4f5f9
}
`

export const initSemUI = () => {
  const injectedStyle = document.createElement('style')
  injectedStyle.innerHTML = styleToInject
  document.head.append(injectedStyle)

  zenModeModel.store.listen(value => {
    if (value) document.body.classList.add(zenMode)
    else document.body.classList.remove(zenMode)
  })

  showFooterModel.store.listen(value => {
    if (value) document.body.classList.remove(hideFooter)
    else document.body.classList.add(hideFooter)
  })

  showMenuModel.store.listen(value => {
    if (value) document.body.classList.remove(hideSidebar)
    else document.body.classList.add(hideSidebar)
  })

  stickySidebarModel.store.listen(value => {
    if (value) document.body.classList.add(stickySidebar)
    else document.body.classList.remove(stickySidebar)
  })
}
