import { bindStorage } from '@src/shared/bindStorage'
import { action, atom } from 'nanostores'

export const zenModeModel = makeBooleanModel('zenMode', false)
export const showMenuModel = makeBooleanModel('showMenu', true)
export const showFooterModel = makeBooleanModel('showFooter', true)
export const showTriggerModel = makeBooleanModel('showTrigger', true)
export const stickySidebarModel = makeBooleanModel('stickySidebar', false)

const $openKey = atom('k')
bindStorage($openKey, 'openKey')
export const openKeyModel = {
  store: $openKey,
  set: $openKey.set,
}

/**
 * Create a boolean model binded to storage
 * @param key storage key
 * @param defaultValue default value
 * @returns model
 */
function makeBooleanModel(key: string, defaultValue: boolean) {
  const $store = atom(defaultValue)
  bindStorage($store, key)
  return {
    store: $store,
    set: $store.set,
    toggle: action($store, `toggle/${key}`, (store, state?: boolean) => {
      store.set(state ?? !store.get())
    }),
  }
}
