import { linkToOption } from '../shared/linkToOption'
import { apps } from './apps'
import { extraTools } from './extraTools'
import { menuTools } from './menuTools'
import { resources } from './resources'

export function getOptions() {
  return [...menuTools, ...extraTools, ...resources, ...apps].map(linkToOption)
}
