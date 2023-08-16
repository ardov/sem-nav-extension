import type { Option } from '@src/model/options'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { Command } from 'cmdk'
import { useFilter } from '@src/model/useFilter'
import { initState, useAppReducer } from '@src/model/state'
import { SearchIcon } from '@src/shared/icons'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const [state, dispatch] = useAppReducer()
  const filter = useFilter(state)
  const setOpened = useCallback(() => setOpen(true), [])

  // useCommandTrigger(setOpened)

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

  const currOption = state.options[value]

  return (
    <Command.Dialog
      value={value}
      onValueChange={setValue}
      filter={filter}
      loop
      open={open}
      onOpenChange={setOpen}
      onKeyDown={toggleFav}
    >
      <div className="snav-header">
        <Command.Input
          autoFocus
          placeholder="What are you looking for?"
          value={search}
          onValueChange={setSearch}
        />
        <SearchIcon className="snav-search-icon" />
      </div>

      <div className="snav-content">
        <Command.List className="snav-list snav-scrollbar">
          <Command.Empty>No results found.</Command.Empty>

          {Object.values(state.options).map(option => {
            return (
              <OptionItem
                key={option.id}
                option={option}
                isFav={state.favourites.includes(option.id)}
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

const OptionItem: FC<{
  option: Option
  isFav?: boolean
  onSelect: () => void
}> = props => {
  const { option, isFav: isFvav, onSelect } = props
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
    if (!ulRoot) return
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
