import { $options, type Option } from '@src/model/options'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { Command } from 'cmdk'
import { scoreOption } from '@src/model/scoreOption'
import { SearchIcon } from '@src/shared/icons'
import { useStore } from '@nanostores/react'
import { settings } from '@src/model/userSettings'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const setOpened = useCallback(() => setOpen(true), [])
  const options = useStore($options)
  const userSettings = useStore(settings.store)

  // useCommandTrigger(setOpened)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = userSettings.openKey
      // Toggle the menu when ⌘K is pressed
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [userSettings.openKey])

  const toggleFav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        settings.toggleFavourite(value)
      }
    },
    [value]
  )

  const ids = Object.entries(options)
    .map(
      ([id, option]) =>
        [
          id,
          scoreOption(
            option,
            userSettings.favourites.includes(option.id),
            search
          ),
        ] as [string, number]
    )
    .filter(([id, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => id)

  const currOption = options[value]

  return (
    <Command.Dialog
      value={value}
      onValueChange={setValue}
      // filter={filter}
      shouldFilter={false}
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
          {ids.map(id => {
            return (
              <OptionItem
                key={id}
                option={options[id]}
                isFav={userSettings.favourites.includes(id)}
                onSelect={options[id].action}
              />
            )
          })}
        </Command.List>

        <div className="snav-details snav-scrollbar">
          <Description
            option={currOption}
            isFav={userSettings.favourites.includes(currOption?.id)}
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
