import { Dispatch, useCallback, useReducer } from 'react'
import { footer, menu } from './elements'
import { getOptions } from '../options'

type Act<T, P> = { type: T; payload: P }

type Action =
  | Act<'goto', string>
  | Act<'favToggle', string>
  | Act<'toggleFooter', null>
  | Act<'toggleLeftMenu', null>
  | Act<'setFavourites', string[]>
  | Act<'setOptions', Option[]>

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

export type AppState = {
  favourites: string[]
  pages: string[]
  options: Option[]
}

const initialState: AppState = {
  favourites: [],
  pages: [],
  options: [
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
    ...getOptions(),
  ],
}

const reducer = (state: AppState, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'goto':
      window.open(payload, '_self')
      return state

    case 'toggleFooter':
      footer.toggle()
      return state

    case 'toggleLeftMenu':
      menu.toggle()
      return state

    case 'setFavourites':
      return { ...state, favourites: payload }

    case 'favToggle': {
      const { favourites } = state
      const index = favourites.indexOf(payload)
      if (index === -1) {
        const nextState = { ...state, favourites: [...favourites, payload] }
        chrome.storage.local.set({ favourites: nextState.favourites })
        return nextState
      } else {
        const nextState = {
          ...state,
          favourites: favourites.filter(f => f !== payload),
        }
        chrome.storage.local.set({ favourites: nextState.favourites })
        return nextState
      }
    }

    default:
      return state
  }
}

export function useAppReducer() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const withThunk = useCallback(
    (action: Action | ((d: typeof dispatch) => void)) => {
      if (typeof action === 'function') {
        action(dispatch)
      } else {
        dispatch(action)
      }
    },
    [dispatch]
  )
  return [state, withThunk] as [AppState, typeof withThunk]
}

export function initState(dispatch: React.Dispatch<Action>) {
  chrome.storage.local.get(['favourites'], result => {
    const favourites = result.favourites || []
    dispatch({ type: 'setFavourites', payload: favourites })
  })
}
