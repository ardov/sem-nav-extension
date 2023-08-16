import { action, computed, map, onMount, task } from 'nanostores'
import { footer, menu } from './uiElements'

type Settings = {
  showFooter: boolean
  showMenu: boolean
  favourites: string[]
  openKey: string
}
type RawSettings = Partial<Settings>
const keys: (keyof RawSettings)[] = [
  'showFooter',
  'showMenu',
  'favourites',
  'openKey',
]

const $rawSettings = map<RawSettings>({})

onMount($rawSettings, () => {
  // Get saved values
  task(async () => {
    const result = await chrome.storage.local.get(keys)
    const nextValue = {}
    keys.forEach(key => {
      nextValue[key] = result[key]
    })
    $rawSettings.set(nextValue)
  })

  // Listen for changes
  const listener: (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: 'sync' | 'local' | 'managed' | 'session'
  ) => void = (changes, namespace) => {
    if (namespace !== 'local') return
    const prevValue = $rawSettings.get()
    const updates = {}
    Object.entries(changes).forEach(([key, change]) => {
      if (
        keys.includes(key as keyof RawSettings) &&
        prevValue[key] !== change.newValue
      ) {
        updates[key] = change.newValue
      }
    })
    if (Object.keys(updates).length === 0) return
    $rawSettings.set({ ...prevValue, ...updates })
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
})

// Save values
$rawSettings.listen(raw => {
  chrome.storage.local.set(raw)
})

// Computed store with values that can be used in the app
export const $settings = computed($rawSettings, raw => {
  const settings: Settings = {
    showFooter: !(raw.showFooter === false),
    showMenu: !(raw.showMenu === false),
    favourites: raw.favourites || [],
    openKey: raw.openKey || 'k',
  }
  return settings
})

$settings.listen(settings => {
  if (settings.showFooter) footer.show()
  else footer.hide()

  if (settings.showMenu) menu.show()
  else menu.hide()
})

// ACTIONS

const toggleFooter = action($rawSettings, 'toggleFooter', store => {
  const current = store.get()['showFooter']
  if (current === false) store.setKey('showFooter', true)
  else store.setKey('showFooter', false)
})

const toggleMenu = action($rawSettings, 'toggleMenu', store => {
  const current = store.get()['showMenu']
  if (current === false) store.setKey('showMenu', true)
  else store.setKey('showMenu', false)
})

const toggleFavourite = action(
  $rawSettings,
  'toggleFavourite',
  (store, key) => {
    const current = store.get()['favourites']
    if (!current) store.setKey('favourites', [key])
    if (current?.includes(key))
      store.setKey(
        'favourites',
        current.filter(k => k !== key)
      )
    else store.setKey('favourites', [...current, key])
  }
)

const setOpenKey = action($rawSettings, 'setOpenKey', (store, key) => {
  store.setKey('openKey', key)
})

export const settings = {
  store: $settings,
  rawStore: $rawSettings,
  toggleFooter,
  toggleMenu,
  toggleFavourite,
  setOpenKey,
}
