import React from 'react'
import { useStore } from '@nanostores/react'
import { settings } from '@src/model/userSettings'
import { cmdStroke } from '@src/shared/cmdStroke'

export const Popup = () => {
  const userSettings = useStore(settings.store)
  const { openKey, showFooter, showMenu, showTrigger, zenMode } = userSettings
  return (
    <div className="app">
      <header className="app-header">Settings</header>

      <label className="setting">
        <span className="setting-label">Command menu</span>
        <select
          value={openKey}
          onChange={e => settings.setOpenKey(e.target.value)}
        >
          <option value="k">{cmdStroke('K')}</option>
          <option value="e">{cmdStroke('E')}</option>
          <option value="/">{cmdStroke('/')}</option>
        </select>
      </label>

      <label className="setting">
        <span className="setting-label">Menu trigger</span>
        <select
          value={String(showTrigger)}
          onChange={e => settings.toggleTrigger()}
        >
          <option value="false">Hide</option>
          <option value="true">Show</option>
        </select>
      </label>

      <label className="setting">
        <span className="setting-label">Left menu</span>
        <select value={String(showMenu)} onChange={e => settings.toggleMenu()}>
          <option value="false">Hide</option>
          <option value="true">Show</option>
        </select>
      </label>

      <label className="setting">
        <span className="setting-label">Footer</span>
        <select
          value={String(showFooter)}
          onChange={e => settings.toggleFooter()}
        >
          <option value="false">Hide</option>
          <option value="true">Show</option>
        </select>
      </label>

      <label className="setting">
        <span className="setting-label">Zen mode</span>
        <select
          value={String(zenMode)}
          onChange={e => settings.toggleZenMode()}
        >
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
    </div>
  )
}

export default Popup
