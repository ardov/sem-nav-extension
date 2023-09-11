import type { CollectionId, LinkId } from '@src/data'
import { staticOptions } from '@src/model/options/staticOptions'
import React, { useMemo } from 'react'
import { Command, CommandGroup } from 'cmdk'
import { scoreOption } from '@src/model/options/scoreOption'
import { useStore } from '@nanostores/react'

import { collectionModel } from '@src/model/collections'
import { OptionItem } from './OptionItem'
import { optionsMetaModel } from '../optionsMeta'
import { makeContextOptions } from './contextOptions'

export function FilteredOptions(props: { search: string }) {
  const search = props.search.toLowerCase()
  const metaData = useStore(optionsMetaModel.store)
  const currentFolderId = useStore(collectionModel.current)
  const currentFolder = staticOptions[currentFolderId]
  const contextOptions = useMemo(() => makeContextOptions(search), [search])

  if (!search && !currentFolder) return <DefaultView key="default" />

  const ids = Object.entries(staticOptions)
    .filter(([id]) => {
      if (!currentFolder) return true
      return currentFolder.subItems.includes(id)
    })
    .map(
      ([id, option]) =>
        [id, scoreOption(option, metaData[option.id], search)] as [
          string,
          number,
        ]
    )
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)

  // Cmdk has a bug not updating the value after facing an empty list
  // This hack is used to prevent the empty list from showing up
  if (ids.length === 0 && contextOptions.length === 0)
    return [<Command.Item key="nothing-found">Nothing found.</Command.Item>]

  return [
    ...contextOptions.map(option => (
      <OptionItem
        key={option.id}
        option={option}
        isFav={metaData[option.id]?.isFavourite}
        onSelect={option.action}
      />
    )),
    ...ids.map(id => {
      return (
        <OptionItem
          key={id}
          option={staticOptions[id]}
          isFav={metaData[id]?.isFavourite}
          onSelect={staticOptions[id].action}
        />
      )
    }),
  ]
}

const featuredCollections: CollectionId[] = [
  'seo',
  'smm',
  'content',
  'market-research',
  'advertising',
]

const suggestedSettings = ['toggle-zen-mode', 'toggle-left-menu']

const suggestedApps: LinkId[] = [
  'position-tracking',
  'site-audit',
  'backlink-analytics',
  'keyword-magic-tool',
  'organic-research',
  'blog',
  'topic-research',
]

function DefaultView() {
  const metaData = useStore(optionsMetaModel.store)

  const contextOptions = makeContextOptions('')
  const featured = featuredCollections.map(id => staticOptions[id])

  const favourites = Object.entries(metaData)
    .filter(([, meta]) => meta.isFavourite)
    .map(([id]) => staticOptions[id])
    .filter(Boolean)
    .filter(option => !featured.includes(option))

  const RECENT_GAP = 1000 * 60 * 60 * 12 // 12 hours
  const recent = Object.entries(metaData)
    .filter(
      ([, meta]) => meta.lastUsed && Date.now() - meta.lastUsed < RECENT_GAP
    )
    .sort((a, b) => b[1].lastUsed - a[1].lastUsed)
    .map(([id]) => staticOptions[id])
    .filter(Boolean)
    .filter(option => !featured.includes(option))
    .filter(option => !favourites.includes(option))
    .slice(0, 3)

  const suggested = [...suggestedSettings, ...suggestedApps]
    .map(id => staticOptions[id])
    .filter(Boolean)
    .filter(option => !featured.includes(option))
    .filter(option => !favourites.includes(option))
    .filter(option => !recent.includes(option))

  return (
    <>
      {contextOptions.length > 0 && (
        <CommandGroup key="context" heading="Context">
          {contextOptions.map(option => (
            <OptionItem
              key={option.id}
              option={option}
              isFav={metaData[option.id]?.isFavourite}
              onSelect={option.action}
            />
          ))}
        </CommandGroup>
      )}

      {favourites.length > 0 && (
        <CommandGroup key="favourites" heading="Favourites">
          {favourites.map(option => (
            <OptionItem
              key={option.id}
              option={option}
              isFav={metaData[option.id]?.isFavourite}
              onSelect={option.action}
            />
          ))}
        </CommandGroup>
      )}

      {recent.length > 0 && (
        <CommandGroup key="recent" heading="Recently used">
          {recent.map(option => (
            <OptionItem
              key={option.id}
              option={option}
              isFav={metaData[option.id]?.isFavourite}
              onSelect={option.action}
            />
          ))}
        </CommandGroup>
      )}

      {featured.length > 0 && (
        <CommandGroup
          key="featured"
          heading="Collections"
          className="snav-collections-group"
        >
          {featured.map(option => (
            <Command.Item
              key={option.id}
              onSelect={option.action}
              className="snav-collections-group-item"
            >
              {option.name}
            </Command.Item>
          ))}
        </CommandGroup>
      )}

      {suggested.length > 0 && (
        <CommandGroup key="suggested" heading="Suggested">
          {suggested.map(option => (
            <OptionItem
              key={option.id}
              option={option}
              isFav={metaData[option.id]?.isFavourite}
              onSelect={option.action}
            />
          ))}
        </CommandGroup>
      )}
    </>
  )
}
