import type { Link } from '@src/shared/links/types'
import type { Dispatch } from 'react'
import { deepMap } from 'nanostores'
import { getLinks } from '@src/shared/links'
import { settings } from './userSettings'

export type Option = {
  id: string
  name: string
  action: () => void
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
      action: () => settings.toggleFooter(),
    },
    {
      id: 'toggle-left-menu',
      name: 'Toggle left menu',
      action: () => settings.toggleMenu(),
    },
    {
      id: 'set-to-p',
      name: 'Set to Cmd+P',
      action: () => settings.setOpenKey('p'),
    },
    {
      id: 'set-to-k',
      name: 'Set to Cmd+K',
      action: () => settings.setOpenKey('k'),
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
