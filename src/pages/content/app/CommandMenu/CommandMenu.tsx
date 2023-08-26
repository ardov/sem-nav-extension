import type { Option } from '@src/model/options'
import React, { FC, useCallback } from 'react'
import { Command } from 'cmdk'
import { useStore } from '@nanostores/react'
import { SearchIcon } from '@src/shared/icons'
import { folders } from '@src/model/folders'
import { menuVisibility } from '@src/model/menuVisibility'
import { openKeyModel } from '@src/model/userSettings'
import { useFilteredOptions } from '@src/model/options'
import { optionsMetaModel } from '@src/model/optionsMeta'

const foldersToSwitch = [undefined, 'SEO', 'Advertising', 'Social Media']
export function CommandMenu() {
  const [value, setValue] = React.useState<string>('')
  const [search, setSearch] = React.useState<string>('')
  const openKey = useStore(openKeyModel.store)
  const metaData = useStore(optionsMetaModel.store)
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
      // Next folder
      if (e.key === 'ArrowRight' && isSearchEmpty && folderList.length <= 1) {
        const idx = foldersToSwitch.indexOf(folderList[0])
        const nextFolder = foldersToSwitch[idx + 1]
        folders.set(nextFolder ? [nextFolder] : [])
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openKey, isSearchEmpty, folderList])

  const toggleFav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        optionsMetaModel.toggleFavourite(value)
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
          <div className="snav-folder" key={name}>
            {name}
          </div>
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
            isFav={metaData[currOption?.id]?.isFavourite}
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
