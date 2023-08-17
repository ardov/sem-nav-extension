import { $options, type Option } from '@src/model/options'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { Command } from 'cmdk'
import { scoreOption } from '@src/model/scoreOption'
import { SearchIcon } from '@src/shared/icons'
import { useStore } from '@nanostores/react'
import { settings } from '@src/model/userSettings'
import { cmdStroke } from '@src/shared/cmdStroke'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const setOpened = useCallback(() => setOpen(true), [])
  const options = useStore($options)
  const userSettings = useStore(settings.store)
  const { openKey, favourites, showTrigger } = userSettings

  useCommandTrigger(setOpened, openKey, showTrigger)

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = openKey
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openKey])

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
        [id, scoreOption(option, favourites.includes(option.id), search)] as [
          string,
          number,
        ]
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
                isFav={favourites.includes(id)}
                onSelect={options[id].action}
              />
            )
          })}
        </Command.List>

        <div className="snav-details snav-scrollbar">
          <Description
            option={currOption}
            isFav={favourites.includes(currOption?.id)}
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
  const { option, isFav, onSelect } = props
  const { name, renderName, iconUrl, id } = option
  return (
    <Command.Item value={id} onSelect={onSelect}>
      {isFav && '★ '}
      {renderName ? renderName() : name}
      {iconUrl && (
        <img
          src={iconUrl}
          alt=""
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            left: 8,
            top: 8,
            borderRadius: 4,
          }}
        />
      )}
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
function useCommandTrigger(cb: () => void, key = 'k', showTrigger: boolean) {
  useEffect(() => {
    if (!showTrigger) return
    const ulRoot = document.getElementsByClassName(
      'srf-report-sidebar-main'
    )[0] as HTMLElement
    if (!ulRoot) return
    const wrapper = document.createElement('div')
    wrapper.className = 'snav-trigger-wrapper'
    const btn = document.createElement('button')
    btn.className = 'snav-trigger'
    btn.innerHTML = `Search (${cmdStroke(key.toUpperCase())})`
    btn.onclick = cb
    wrapper.appendChild(btn)
    ulRoot.insertBefore(wrapper, ulRoot.firstChild)

    return () => {
      ulRoot.removeChild(wrapper)
    }
  }, [cb, key, showTrigger])
}
