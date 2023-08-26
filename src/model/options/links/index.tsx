export type { Link } from './types'
import { apps } from './apps'
import { extraTools } from './extraTools'
import { menuTools } from './menuTools'
import { other } from './other'
import { resources } from './resources'
import { Link } from './types'

export function getLinks() {
  return mergeLinks([
    ...menuTools,
    ...extraTools,
    ...resources,
    ...apps,
    ...other,
  ])
}

function mergeLinks(links: Link[]) {
  const byId = {} as Record<string, Link>
  links.forEach(link => {
    if (!byId[link.id]) {
      byId[link.id] = { ...link }
      return
    }
    // Assign non empty props from this link to the existing one
    Object.entries(link).forEach(([key, value]) => {
      if (value) byId[link.id][key] = value
    })
  })
  return Object.values(byId)
}
