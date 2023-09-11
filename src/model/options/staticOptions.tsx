import type { LinkType, Status } from '@src/data'
import { useStore } from '@nanostores/react'
import { collections, links } from '@src/data'
import { menuVisibility } from '../menuVisibility'
import { collectionModel } from '../collections'
import { showFooterModel, showMenuModel, zenModeModel } from '../userSettings'

export type OptionType = LinkType | 'collection' | 'action'

type OptionId = string

export type Option = {
  id: OptionId
  name: string
  type: OptionType
  action: () => void
  RenderName?: () => React.ReactNode
  RenderDescription?: () => React.ReactNode
  status?: Status
  developer?: string
  description?: string
  collections?: OptionId[]
  icon?: string
  iconUrl?: string
  subItems?: OptionId[]
}

/** A list of options vreated from links */
const linkOptions: Option[] = links.list.map(link => {
  return {
    id: link.id,
    name: link.name,
    type: link.type,
    action: () => window.open(link.url, '_self'),
    status: link.status,
    developer: link.developer,
    description: link.description,
    collections: link.collections,
    // icon: '🔗',
    iconUrl: link.iconUrl,
  }
})

/** A list of options created from collections */
const linkCollectionOptions: Option[] = collections.list.map(collection => {
  return {
    id: collection.id,
    name: collection.name,
    type: 'collection',
    action: () => collectionModel.push(collection.id),
    description: collection.description,
    icon: '🗂️',
    subItems: [
      ...(collection.sub_links || []),
      ...(collection.sub_collection_links || []),
      ...(collection.sub_collections || []),
    ],
  }
})

const settingsOptions: Option[] = [
  {
    id: 'toggle-zen-mode',
    name: 'Toggle zen mode',
    type: 'action',
    RenderName: () => {
      const zenMode = useStore(zenModeModel.store)
      return zenMode ? 'Turn off zen mode' : 'Turn on zen mode'
    },
    action: () => {
      menuVisibility.set(false)
      zenModeModel.toggle()
    },
    icon: '🧘',
  },
  {
    id: 'toggle-footer',
    name: 'Toggle footer',
    type: 'action',
    RenderName: () => {
      const showFooter = useStore(showFooterModel.store)
      return showFooter ? 'Hide footer' : 'Show footer'
    },
    action: () => {
      menuVisibility.set(false)
      showFooterModel.toggle()
    },
    icon: '⚙️',
  },
  {
    id: 'toggle-left-menu',
    name: 'Toggle left menu',
    type: 'action',
    RenderName: () => {
      const showMenu = useStore(showMenuModel.store)
      return showMenu ? 'Hide left menu' : 'Show left menu'
    },
    action: () => {
      menuVisibility.set(false)
      showMenuModel.toggle()
    },
    icon: '⚙️',
  },
]

export const staticOptions: Record<string, Option> = [
  ...linkOptions,
  ...linkCollectionOptions,
  ...settingsOptions,
].reduce(
  (acc, opt) => {
    acc[opt.id] = opt
    return acc
  },
  {} as Record<string, Option>
)
