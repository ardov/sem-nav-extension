import { OptionMeta } from '../optionsMeta'
import { Option } from './options'

export function scoreOption(
  option: Option,
  meta: OptionMeta | undefined,
  search: string
): number {
  if (!option) return 0
  const favScore = meta?.isFavourite ? 1 : 0
  const usageScore = getUsageScore(meta)
  if (!search) return 1 + favScore + usageScore
  const name = option.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const description =
    option.description?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
  const nameScore = calcScore(name, search)
  const descriptionScore = calcScore(description, search) * 0.2
  if (!nameScore && !descriptionScore) return 0
  const score = Math.max(nameScore, descriptionScore) + favScore + usageScore
  return score
}

/**
 * Functions calculates the score of an option based on its usage
 * frequent and recent usage will increase the score
 * @param meta
 * @returns
 */
function getUsageScore(meta: OptionMeta | null): number {
  if (!meta || !meta.lastUsed || !meta.useCount) return 1
  // Usage older than 10 days is not considered
  const days = (Date.now() - meta.lastUsed) / 1000 / 60 / 60 / 24
  if (days > 10) return 1.1

  const usageBonus = Math.min(meta.useCount, 10) * 0.1
  const daysBonus = Math.max(10 - days, 0) * 0.1
  return 1 + usageBonus + daysBonus
}

function calcScore(value: string, search: string): number {
  if (!value) return 0
  if (value.startsWith(search)) return 1
  if (value.includes(search)) return 0.9
  return 0
}
