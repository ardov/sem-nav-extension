import { Option } from '../CommandMenu/state'
import { Link } from './types'

export function linkToOption(link: Link): Option {
  return {
    id: link.id,
    name: link.name,
    action: { type: 'goto', payload: link.url },
    status: link.status,
    // caption?: string
    description: link.description,
    tags: link.tags,
    // icon?: string
    // iconUrl?: string
  }
}
