import type { Link } from './links/types'
import { useStore } from '@nanostores/react'
import { deepMap } from 'nanostores'
import { getLinks } from './links'
import { menuVisibility } from '../menuVisibility'
import { folders } from '../folders'
import { showFooterModel, showMenuModel, zenModeModel } from '../userSettings'

export type Option = {
  id: string
  name: string
  action: () => void
  RenderName?: () => React.ReactNode
  RenderDescription?: () => React.ReactNode
  status?: 'new' | 'beta'
  caption?: string
  description?: string
  tags?: string[]
  icon?: string
  iconUrl?: string
}

export const $options = deepMap<Record<string, Option>>(getOptions())

function getOptions(): Record<string, Option> {
  const opts: Record<string, Option> = {}
  const optList: Option[] = [
    {
      id: 'toggle-zen-mode',
      name: 'Toggle zen mode',
      RenderName: () => {
        const zenMode = useStore(zenModeModel.store)
        return zenMode ? 'Turn off zen mode' : 'Turn on zen mode'
      },
      action: () => {
        zenModeModel.toggle()
        menuVisibility.set(false)
      },
      icon: '🧘',
    },
    {
      id: 'toggle-footer',
      name: 'Toggle footer',
      RenderName: () => {
        const showFooter = useStore(showFooterModel.store)
        return showFooter ? 'Hide footer' : 'Show footer'
      },
      action: () => {
        showFooterModel.toggle()
        menuVisibility.set(false)
      },
      icon: '⚙️',
    },
    {
      id: 'toggle-left-menu',
      name: 'Toggle left menu',
      RenderName: () => {
        const showMenu = useStore(showMenuModel.store)
        return showMenu ? 'Hide left menu' : 'Show left menu'
      },
      action: () => {
        showMenuModel.toggle()
        menuVisibility.set(false)
      },
      icon: '⚙️',
    },
    {
      id: 'seo',
      name: 'SEO Tools',
      action: () => folders.push('SEO'),
      icon: '📂',
    },
    {
      id: 'advertising',
      name: 'Advertising Tools',
      action: () => folders.push('Advertising'),
      icon: '📂',
    },
    {
      id: 'smm',
      name: 'SMM Tools',
      action: () => folders.push('Social media'),
      icon: '📂',
    },
    {
      id: 'content',
      name: 'Content Tools',
      action: () => folders.push('Content marketing'),
      icon: '📂',
    },
    ...getLinks().map(linkToOption),
  ]

  optList.forEach(option => {
    opts[option.id] = option
  })

  return opts
}

function linkToOption(link: Link): Option {
  return {
    id: link.id,
    name: link.name,
    action: () => window.open(link.url, '_self'),
    status: link.status,
    // caption?: string
    description: link.description,
    tags: link.tags,
    // icon: link.icon
    iconUrl: link.iconUrl,
  }
}
