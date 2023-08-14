import { linkToOption } from '../shared/linkToOption'
import { extraTools } from './extraTools'
import { menuTools } from './menuTools'
import { resources } from './resources'

export function getOptions() {
  return [...menuTools, ...extraTools, ...resources].map(linkToOption)
}
