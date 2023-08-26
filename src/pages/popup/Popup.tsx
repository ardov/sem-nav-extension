import React from 'react'
import { useStore } from '@nanostores/react'
import { cmdStroke } from '@src/shared/cmdStroke'
import {
  openKeyModel,
  showFooterModel,
  showMenuModel,
  showTriggerModel,
  stickySidebarModel,
  zenModeModel,
} from '@src/model/userSettings'

export const Popup = () => {
  const openKey = useStore(openKeyModel.store)
  const showFooter = useStore(showFooterModel.store)
  const showTrigger = useStore(showTriggerModel.store)
  const zenMode = useStore(zenModeModel.store)

  return (
    <div className="app">
      <header className="app-header">Settings</header>

      <label className="setting">
        <span className="setting-label">Command menu</span>
        <select
          value={openKey}
          onChange={e => openKeyModel.set(e.target.value)}
        >
          <option value="k">{cmdStroke('K')}</option>
          <option value="e">{cmdStroke('E')}</option>
          <option value="/">{cmdStroke('/')}</option>
        </select>
      </label>

      <LeftMenuSetting />

      <label className="setting">
        <span className="setting-label">Menu trigger</span>
        <select
          value={String(showTrigger)}
          onChange={e => showTriggerModel.toggle()}
        >
          <option value="false">Hide</option>
          <option value="true">Show</option>
        </select>
      </label>

      <label className="setting">
        <span className="setting-label">Footer</span>
        <select
          value={String(showFooter)}
          onChange={e => showFooterModel.toggle()}
        >
          <option value="false">Hide</option>
          <option value="true">Show</option>
        </select>
      </label>

      <label className="setting">
        <span className="setting-label">Zen mode</span>
        <select value={String(zenMode)} onChange={e => zenModeModel.toggle()}>
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
    </div>
  )
}

export default Popup

function LeftMenuSetting() {
  const showMenu = useStore(showMenuModel.store)
  const stickySidebar = useStore(stickySidebarModel.store)
  const value = showMenu ? (stickySidebar ? 'sticky' : 'normal') : 'hidden'
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'sticky') {
      stickySidebarModel.toggle(true)
      showMenuModel.toggle(true)
      return
    }
    if (value === 'normal') {
      stickySidebarModel.toggle(false)
      showMenuModel.toggle(true)
      return
    }
    if (value === 'hidden') {
      showMenuModel.toggle(false)
      return
    }
  }

  return (
    <label className="setting">
      <span className="setting-label">Left menu</span>
      <select value={String(value)} onChange={onChange}>
        <option value="normal">Normal</option>
        <option value="sticky">Sticky</option>
        <option value="hidden">Hidden</option>
      </select>
    </label>
  )
}
