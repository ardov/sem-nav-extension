import { $options, type Option } from '@src/model/options'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { Command } from 'cmdk'
import { scoreOption } from '@src/model/scoreOption'
import { SearchIcon } from '@src/shared/icons'
import { useStore } from '@nanostores/react'
import { settings } from '@src/model/userSettings'
import { cmdStroke } from '@src/shared/cmdStroke'
import { folders } from '@src/model/folders'
import { menuVisibility } from '@src/model/menuVisibility'

export function CommandMenu() {
  const [value, setValue] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const options = useStore($options)
  const userSettings = useStore(settings.store)
  const { openKey, favourites, showTrigger } = userSettings
  const folderList = useStore(folders.store)
  const currentFolder = useStore(folders.current)
  const open = useStore(menuVisibility.store)
  const isSearchEmpty = search === ''

  useCommandTrigger(openKey, showTrigger)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = openKey
      // Toggle the menu when ⌘K is pressed
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        menuVisibility.toggle()
      }
      // Remove folder on backspace
      if (e.key === 'Backspace' && isSearchEmpty) {
        folders.pop()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openKey, isSearchEmpty])

  const toggleFav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        settings.toggleFavourite(value)
      }
    },
    [value]
  )

  const lSearch = search.toLowerCase()
  const ids = Object.entries(options)
    .filter(([id, option]) => {
      if (!currentFolder) return true
      return option.tags?.includes(currentFolder)
    })
    .map(
      ([id, option]) =>
        [id, scoreOption(option, favourites.includes(option.id), lSearch)] as [
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
      // open={true}
      onOpenChange={menuVisibility.set}
      onKeyDown={toggleFav}
    >
      <div className="snav-header">
        {folderList.map(name => (
          <div className="snav-folder">{name}</div>
        ))}
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
          {
            // Cmdk has a bug not updating the value after facing an empty list
            // This hack is used to prevent the empty list from showing up
            ids.length === 0 && <Command.Item>Nothing found.</Command.Item>
          }
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
  const { name, renderName, iconUrl, id, icon } = option
  return (
    <Command.Item value={id} onSelect={onSelect}>
      {isFav && '★ '}
      {renderName ? renderName() : name}
      {iconUrl ? (
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
      ) : icon ? (
        <div
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            left: 8,
            top: 8,
            borderRadius: 4,
            verticalAlign: 'middle',
            textAlign: 'center',
            fontSize: '20px',
          }}
        >
          {icon}
        </div>
      ) : null}
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
          <button
            key={tag}
            className="snav-tag"
            onClick={() => folders.push(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </>
  )
}

/** Add a button to the menu to open command menu */
function useCommandTrigger(key = 'k', showTrigger: boolean) {
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
    btn.onclick = menuVisibility.toggle
    wrapper.appendChild(btn)
    ulRoot.insertBefore(wrapper, ulRoot.firstChild)

    return () => {
      ulRoot.removeChild(wrapper)
    }
  }, [key, showTrigger])
}
