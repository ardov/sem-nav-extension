import { action, atom } from 'nanostores'

const $menuVisibility = atom<boolean>(false)

const set = action($menuVisibility, 'setMenu', (store, value: boolean) => {
  store.set(value)
})

const toggle = action($menuVisibility, 'toggleMenu', store => {
  store.set(!store.get())
})

export const menuVisibility = {
  store: $menuVisibility,
  set,
  toggle,
}
