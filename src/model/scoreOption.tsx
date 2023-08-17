import { Option } from './options'

export function scoreOption(
  option: Option,
  isFavourite: boolean,
  search: string
): number {
  if (!option) return 0
  const favScore = isFavourite ? 1 : 0
  if (!search) return 1 + favScore
  const name = option.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const description =
    option.description?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
  const nameScore = calcScore(name, search)
  const descriptionScore = calcScore(description, search) * 0.2
  if (!nameScore && !descriptionScore) return 0
  const score = Math.max(nameScore, descriptionScore) + favScore
  return score
}

function calcScore(value: string, search: string): number {
  if (!value) return 0
  if (value.startsWith(search)) return 1
  if (value.includes(search)) return 0.9
  return 0
}
