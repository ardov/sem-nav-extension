import { WritableAtom, onMount, task } from 'nanostores'

/**
 * Bind a nanostore to chrome.storage.local
 * @param store — store to bind
 * @param key — key to use in chrome.storage.local
 * @param isEqual — optional function to compare old and new values
 */
export function bindStorage<T>(
  store: WritableAtom<T>,
  key: string,
  isEqual = (a: T, b: T) => a === b
) {
  onMount(store, () => {
    // Save store value on change
    const unlisten = store.listen(value => {
      chrome.storage.local.set({ [key]: value })
    })

    // Get initial value
    task(async () => {
      const result = (await chrome.storage.local.get(key)) || {}
      if (key in result) store.set(result[key])
    })

    // Listen for changes
    chrome.storage.onChanged.addListener(listener)

    // Unsubscribe on unmount
    return () => {
      chrome.storage.onChanged.removeListener(listener)
      unlisten()
    }

    // Storage change listener
    function listener(
      changes: { [key: string]: chrome.storage.StorageChange },
      namespace: 'sync' | 'local' | 'managed' | 'session'
    ) {
      if (namespace !== 'local') return
      if (!(key in changes)) return
      const currentValue = store.get()
      const newValue = changes[key].newValue
      if (!isEqual(currentValue, newValue)) store.set(newValue)
    }
  })
}
