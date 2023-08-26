import { bindStorage } from '@src/shared/bindStorage'
import { action, atom } from 'nanostores'

export type OptionMeta = {
  lastUsed?: number
  useCount?: number
  isFavourite?: boolean
  comment?: string
}

const $optionsMeta = atom<Record<string, OptionMeta>>({})
bindStorage($optionsMeta, 'optionsMeta')

const markUsed = action($optionsMeta, 'markUsed', (store, key: string) => {
  const meta = store.get()[key] ?? {}
  store.set({
    ...store.get(),
    [key]: {
      ...meta,
      lastUsed: Date.now(),
      useCount: (meta.useCount ?? 0) + 1,
    },
  })
})

const toggleFavourite = action(
  $optionsMeta,
  'toggleFavourite',
  (store, key: string, state?: boolean) => {
    const meta = store.get()[key] ?? {}
    store.set({
      ...store.get(),
      [key]: {
        ...meta,
        isFavourite: state ?? !meta.isFavourite,
      },
    })
  }
)

export const optionsMetaModel = {
  store: $optionsMeta,
  markUsed,
  toggleFavourite,
}
