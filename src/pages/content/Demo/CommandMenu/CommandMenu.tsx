import React, { useCallback } from 'react'
import { Command } from 'cmdk'
import { initState, useAppReducer } from './state'
import { useFilter } from './useFilter'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
  const [state, dispatch] = useAppReducer()
  const filter = useFilter(state)

  React.useEffect(() => {
    initState(dispatch)
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle the menu when ⌘K is pressed
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const toggleFav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        dispatch({ type: 'favToggle', payload: value })
      }
    },
    [value]
  )

  const currOption = state.options.find(o => o.id === value)
  console.log('currOption', currOption, value, state.options)

  return (
    <Command.Dialog
      value={value}
      onValueChange={v => setValue(v)}
      filter={filter}
      loop
      open={open}
      onOpenChange={setOpen}
      onKeyDown={toggleFav}
    >
      <div className="snav-header">
        <Command.Input autoFocus placeholder="What are you looking for?" />
        <SearchIcon className="snav-search-icon" />
      </div>

      <div className="snav-content">
        <Command.List className="snav-list snav-scrollbar">
          <Command.Empty>No results found.</Command.Empty>
          {state.favourites.length > 0 &&
            state.favourites.map(fav => {
              const option = state.options.find(o => o.id === fav)
              return (
                <Command.Item
                  key={option.id}
                  value={option.id}
                  onSelect={() => dispatch(option.action)}
                >
                  {state.favourites.includes(option.id) && '★ '}
                  {option.name}
                </Command.Item>
              )
            })}

          {state.options.map(option => {
            if (state.favourites.includes(option.id)) return null
            return (
              <Command.Item
                key={option.id}
                value={option.id}
                onSelect={() => dispatch(option.action)}
              >
                {state.favourites.includes(option.id) && '★ '}
                {option.name}
              </Command.Item>
            )
          })}
        </Command.List>

        <div className="snav-details snav-scrollbar">
          {currOption?.description || currOption?.id}
        </div>
      </div>
    </Command.Dialog>
  )
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="m14.7 13.3-4.5-4.6a5 5 0 1 0-1.5 1.5l4.6 4.5a1 1 0 0 0 1.6-1 1 1 0 0 0-.2-.4ZM3 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
    />
  </svg>
)
