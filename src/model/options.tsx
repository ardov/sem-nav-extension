import type { Link } from '@src/shared/links/types'
import type { Dispatch } from 'react'
import type { Action } from './state'
import { getLinks } from '@src/shared/links'

export type Option = {
  id: string
  name: string
  action: Action | ((d: Dispatch<Action>) => void)
  status?: 'new' | 'beta'
  caption?: string
  description?: string
  tags?: string[]
  icon?: string
  iconUrl?: string
}

export const options = getOptions()

function getOptions(): Record<string, Option> {
  let opts: Record<string, Option> = {}
  const optList: Option[] = [
    {
      id: 'toggle-footer',
      name: 'Toggle footer',
      action: { type: 'toggleFooter', payload: null },
    },
    {
      id: 'toggle-left-menu',
      name: 'Toggle left menu',
      action: { type: 'toggleLeftMenu', payload: null },
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
    action: { type: 'goto', payload: link.url },
    status: link.status,
    // caption?: string
    description: link.description,
    tags: link.tags,
    // icon: link.icon
    iconUrl: link.iconUrl,
  }
}
