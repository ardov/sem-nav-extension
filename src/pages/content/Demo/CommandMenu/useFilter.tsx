import { useCallback } from 'react'
import { AppState } from './state'

export const useFilter = (state: AppState) => {
  return useCallback(
    (id: string, search: string): number => {
      if (!search) return 1

      const option = state.options.find(option => option.id === id)
      if (!option) return 0
      if (option.name.toLowerCase().includes(search.toLowerCase())) {
        if (state.favourites.includes(id)) return 3
        return 2
      }
      if (option.description?.toLowerCase().includes(search.toLowerCase()))
        return 1
      return 0
    },
    [state]
  )
}
