import type { Link } from '@src/shared/links/types'
import { deepMap } from 'nanostores'
import { getLinks } from '@src/shared/links'
import { settings } from './userSettings'
import { useStore } from '@nanostores/react'
import { menuVisibility } from './menuVisibility'

export type Option = {
  id: string
  name: string
  action: () => void
  renderName?: () => React.ReactNode
  renderDescription?: () => React.ReactNode
  status?: 'new' | 'beta'
  caption?: string
  description?: string
  tags?: string[]
  icon?: string
  iconUrl?: string
}

export const $options = deepMap<Record<string, Option>>(getOptions())

function getOptions(): Record<string, Option> {
  let opts: Record<string, Option> = {}
  const optList: Option[] = [
    {
      id: 'toggle-zen-mode',
      name: 'Toggle zen mode',
      renderName: () => {
        const { zenMode } = useStore(settings.store)
        return zenMode ? 'Turn off zen mode' : 'Turn on zen mode'
      },
      action: () => {
        settings.toggleZenMode()
        menuVisibility.set(false)
      },
      icon: '🧘',
    },
    {
      id: 'toggle-footer',
      name: 'Toggle footer',
      renderName: () => {
        const { showFooter } = useStore(settings.store)
        return showFooter ? 'Hide footer' : 'Show footer'
      },
      action: () => {
        settings.toggleFooter()
        menuVisibility.set(false)
      },
      icon: '⚙️',
    },
    {
      id: 'toggle-left-menu',
      name: 'Toggle left menu',
      renderName: () => {
        const { showMenu } = useStore(settings.store)
        return showMenu ? 'Hide left menu' : 'Show left menu'
      },
      action: () => {
        settings.toggleMenu()
        menuVisibility.set(false)
      },
      icon: '⚙️',
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
