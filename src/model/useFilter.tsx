import { useCallback } from 'react'
import { AppState } from './state'

export const useFilter = (state: AppState) => {
  return useCallback(
    (id: string, search: string): number => {
      if (!search) return 1
      const option = state.options[id]
      if (!option) return 0
      const name = option.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      const description =
        option.description?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''

      const nameScore = calcScore(name, search)
      const descriptionScore = calcScore(description, search) * 0.2
      if (!nameScore && !descriptionScore) return 0
      const favScore = state.favourites.includes(id) ? 1 : 0
      const score = Math.max(nameScore, descriptionScore) + favScore
      // if (
      //   id === 'domain-overview' ||
      //   id === 'traffic-analytics' ||
      //   id === 'seo-content-template' ||
      //   id === 'social-poster' ||
      //   id === 'position-tracking'
      // )
      //   console.log('score', id, score)
      return score
    },
    [state]
  )
}

function calcScore(value: string, search: string): number {
  if (!value) return 0
  if (value.startsWith(search)) return 1
  if (value.includes(search)) return 0.9
  return 0
}
