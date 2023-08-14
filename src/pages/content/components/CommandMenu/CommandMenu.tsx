import React, { FC, useCallback, useEffect } from 'react'
import { Command } from 'cmdk'
import { Option, initState, useAppReducer } from './state'
import { useFilter } from './useFilter'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
  const [state, dispatch] = useAppReducer()
  const filter = useFilter(state)
  const setOpened = useCallback(() => setOpen(true), [])

  useCommandTrigger(setOpened)

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
                <OptionItem
                  key={option.id}
                  option={option}
                  isFvav={true}
                  onSelect={() => dispatch(option.action)}
                />
              )
            })}

          {state.options.map(option => {
            if (state.favourites.includes(option.id)) return null
            return (
              <OptionItem
                key={option.id}
                option={option}
                onSelect={() => dispatch(option.action)}
              />
            )
          })}
        </Command.List>

        <div className="snav-details snav-scrollbar">
          <Description
            option={currOption}
            isFav={state.favourites.includes(currOption?.id)}
          />
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

const OptionItem: FC<{
  option: Option
  isFvav?: boolean
  onSelect: () => void
}> = props => {
  const { option, isFvav, onSelect } = props
  return (
    <Command.Item value={option.id} onSelect={onSelect}>
      {isFvav && '★ '}
      {option.name}
    </Command.Item>
  )
}

const Description: FC<{
  option: Option
  isFav?: boolean
  onSelect?: () => void
}> = props => {
  const { option, isFav, onSelect } = props
  if (!option) return null
  return (
    <>
      <h2>
        {option.name} {isFav ? '★' : ''}
      </h2>
      <p>{option.description}</p>
      <div className="snav-tags">
        {option.tags?.map(tag => (
          <button key={tag} className="snav-tag">
            {tag}
          </button>
        ))}
      </div>
    </>
  )
}

/** Add a button to the menu to open command menu */
function useCommandTrigger(cb: () => void) {
  useEffect(() => {
    const ulRoot = document.getElementsByClassName(
      'srf-report-sidebar-main'
    )[0] as HTMLElement
    const btn = document.createElement('button')
    btn.className = 'snav-trigger'
    btn.innerHTML = 'Command Menu'
    btn.onclick = cb
    ulRoot.insertBefore(btn, ulRoot.firstChild)

    return () => {
      ulRoot.removeChild(btn)
    }
  }, [cb])
}
