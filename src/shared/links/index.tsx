import { link } from 'fs'
import { apps } from './apps'
import { extraTools } from './extraTools'
import { menuTools } from './menuTools'
import { other } from './other'
import { resources } from './resources'
export type { Link } from './types'

export function getLinks() {
  let ids = []
  return [...menuTools, ...extraTools, ...resources, ...apps, ...other].filter(
    link => {
      if (ids.includes(link.id)) return false
      ids.push(link.id)
      return true
    }
  )
}
