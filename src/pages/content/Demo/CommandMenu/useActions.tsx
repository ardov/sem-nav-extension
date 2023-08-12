import { useReducer } from 'react'
import { footer, menu } from './elements'

type Act<T, P> = { type: T; payload: P }

type Action =
  | Act<'goto', string>
  | Act<'toggleFooter', null>
  | Act<'toggleLeftMenu', null>
  | Act<'setOptions', Option[]>

export type Option = {
  id: string
  name: string
  action: Action
  caption?: string
  icon?: string
  isFavourite?: boolean
}

export type State = {
  pages: string[]
  options: Option[]
}

const initialState: State = {
  pages: [],
  options: [
    {
      id: 'toggleFooter',
      name: 'Toggle footer',
      action: { type: 'toggleFooter', payload: null },
    },
    {
      id: 'toggleLeftMenu',
      name: 'Toggle left menu',
      action: { type: 'toggleLeftMenu', payload: null },
    },
  ],
}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'goto':
      history.pushState({}, '', payload)
      return state

    case 'toggleFooter':
      footer.toggle()
      return state

    case 'toggleLeftMenu':
      menu.toggle()
      return state

    default:
      return state
  }
}

export function useAppReducer() {
  return useReducer(reducer, initialState)
}
