import { action, atom, computed } from 'nanostores'

const $collections = atom<string[]>([])

const pop = action($collections, 'pop', store => {
  store.set(store.get().slice(0, -1))
})

const clear = action($collections, 'clearFolders', store => store.set([]))

const push = action($collections, 'push', (store, folder: string) => {
  if (store.get().includes(folder)) {
    const filtered = store.get().filter(f => f !== folder)
    store.set([...filtered, folder])
    return
  }
  store.set([...store.get(), folder])
})

const current = computed($collections, folders =>
  folders.length ? folders[folders.length - 1] : ''
)

export const collectionModel = {
  store: $collections,
  current,
  set: $collections.set,
  pop,
  clear,
  push,
}
