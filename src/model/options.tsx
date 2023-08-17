import type { Link } from '@src/shared/links/types'
import type { Dispatch } from 'react'
import { deepMap } from 'nanostores'
import { getLinks } from '@src/shared/links'
import { settings } from './userSettings'
import { footer, menu } from './uiElements'
import { useStore } from '@nanostores/react'

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
      id: 'toggle-footer',
      name: 'Toggle footer',
      renderName: () => {
        const { showFooter } = useStore(settings.store)
        return showFooter ? 'Hide footer' : 'Show footer'
      },
      action: () => settings.toggleFooter(),
    },
    {
      id: 'toggle-left-menu',
      name: 'Toggle left menu',
      renderName: () => {
        const { showMenu } = useStore(settings.store)
        return showMenu ? 'Hide left menu' : 'Show left menu'
      },
      action: () => settings.toggleMenu(),
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
