import { action, atom, computed } from 'nanostores'

const $folders = atom<string[]>([])

const pop = action($folders, 'pop', store => {
  store.set(store.get().slice(0, -1))
})

const clear = action($folders, 'clearFolders', store => {
  store.set([])
})

const push = action($folders, 'push', (store, folder: string) => {
  if (store.get().includes(folder)) {
    const filtered = store.get().filter(f => f !== folder)
    store.set([...filtered, folder])
    return
  }
  store.set([...store.get(), folder])
})

const current = computed($folders, folders =>
  folders.length ? folders[folders.length - 1] : ''
)

export const folders = {
  store: $folders,
  current,
  pop,
  clear,
  push,
}
