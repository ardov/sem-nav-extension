import { action, computed, map, onMount, task } from 'nanostores'

type Settings = {
  showFooter: boolean
  showMenu: boolean
  stickySidebar: boolean
  favourites: string[]
  openKey: string
  showTrigger: boolean
  zenMode: boolean
}
type RawSettings = Partial<Settings>
const keys: (keyof RawSettings)[] = [
  'showFooter',
  'showMenu',
  'stickySidebar',
  'favourites',
  'openKey',
  'showTrigger',
  'zenMode',
]

const defaults: Settings = {
  showFooter: true,
  showMenu: true,
  stickySidebar: false,
  favourites: [],
  openKey: 'k',
  showTrigger: false,
  zenMode: false,
}

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
    showFooter: raw.showFooter ?? defaults.showFooter,
    showMenu: raw.showMenu ?? defaults.showMenu,
    stickySidebar: raw.stickySidebar ?? defaults.stickySidebar,
    favourites: raw.favourites || defaults.favourites,
    openKey: raw.openKey || defaults.openKey,
    showTrigger: raw.showTrigger ?? defaults.showTrigger,
    zenMode: raw.zenMode ?? defaults.zenMode,
  }
  return settings
})

// ACTIONS

const toggleFooter = action(
  $rawSettings,
  'toggleFooter',
  (store, state?: boolean) => {
    state = state ?? !(store.get()['showFooter'] ?? defaults.showFooter)
    store.setKey('showFooter', state)
  }
)

const toggleMenu = action(
  $rawSettings,
  'toggleMenu',
  (store, state?: boolean) => {
    state = state ?? !(store.get()['showMenu'] ?? defaults.showMenu)
    store.setKey('showMenu', state)
  }
)

const toggleSticky = action(
  $rawSettings,
  'toggleSticky',
  (store, state?: boolean) => {
    state = state ?? !(store.get()['stickySidebar'] ?? defaults.stickySidebar)
    store.setKey('stickySidebar', state)
  }
)

const toggleZenMode = action(
  $rawSettings,
  'toggleZenMode',
  (store, state?: boolean) => {
    state = state ?? !(store.get()['zenMode'] ?? defaults.zenMode)
    store.setKey('zenMode', state)
  }
)

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

const toggleTrigger = action(
  $rawSettings,
  'toggleTrigger',
  (store, state?: boolean) => {
    state = state ?? !(store.get()['showTrigger'] ?? defaults.showTrigger)
    store.setKey('showTrigger', state)
  }
)

const setOpenKey = action($rawSettings, 'setOpenKey', (store, key: string) => {
  store.setKey('openKey', key)
})

export const settings = {
  store: $settings,
  rawStore: $rawSettings,
  toggleFooter,
  toggleMenu,
  toggleSticky,
  toggleZenMode,
  toggleFavourite,
  toggleTrigger,
  setOpenKey,
}
