import { type Option } from '@src/model/options'
import React, { FC, useCallback } from 'react'
import { Command } from 'cmdk'
import { SearchIcon } from '@src/shared/icons'
import { useStore } from '@nanostores/react'
import { settings } from '@src/model/userSettings'
import { folders } from '@src/model/folders'
import { menuVisibility } from '@src/model/menuVisibility'
import { useFilteredOptions } from './useFilteredOptions'

export function CommandMenu() {
  const [value, setValue] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const userSettings = useStore(settings.store)
  const { openKey, favourites } = userSettings
  const folderList = useStore(folders.store)
  const open = useStore(menuVisibility.store)
  const isSearchEmpty = search === ''
  const { items, options } = useFilteredOptions(search)

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

  const currOption = options[value]

  return (
    <Command.Dialog
      value={value}
      onValueChange={setValue}
      shouldFilter={false}
      loop
      open={open}
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
          {items}
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
