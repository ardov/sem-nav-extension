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

      <LeftMenuSetting />

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

function ToggleSetting(props: {
  label: string
  value: boolean
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  const { label, value, onChange } = props
  return (
    <label className="setting">
      <span className="setting-label">{label}</span>
      <select value={String(value)} onChange={onChange}>
        <option value="false">Hide</option>
        <option value="true">Show</option>
      </select>
    </label>
  )
}

function LeftMenuSetting() {
  const userSettings = useStore(settings.store)
  const { showMenu, stickySidebar } = userSettings
  const value = showMenu ? (stickySidebar ? 'sticky' : 'normal') : 'hidden'
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'sticky') {
      settings.toggleSticky(true)
      settings.toggleMenu(true)
      return
    }
    if (value === 'normal') {
      settings.toggleSticky(false)
      settings.toggleMenu(true)
      return
    }
    if (value === 'hidden') {
      settings.toggleMenu(false)
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
