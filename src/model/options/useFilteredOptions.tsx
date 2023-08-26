import { $options, Option } from '@src/model/options/options'
import React, { useMemo } from 'react'
import { Command } from 'cmdk'
import { scoreOption } from '@src/model/options/scoreOption'
import { useStore } from '@nanostores/react'

import { folders } from '@src/model/folders'
import { OptionItem } from './OptionItem'
import { optionsMetaModel } from '../optionsMeta'

export function useFilteredOptions(search: string) {
  search = search.toLowerCase()
  const options = useStore($options)
  const metaData = useStore(optionsMetaModel.store)
  const currentFolder = useStore(folders.current)

  const contextOptions = useMemo(() => makeContextOptions(search), [search])

  const ids = Object.entries(options)
    .filter(([id, option]) => {
      if (!currentFolder) return true
      return option.tags?.includes(currentFolder)
    })
    .map(
      ([id, option]) =>
        [id, scoreOption(option, metaData[option.id], search)] as [
          string,
          number,
        ]
    )
    .filter(([id, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => id)

  const items = useMemo(() => {
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
            option={options[id]}
            isFav={metaData[id]?.isFavourite}
            onSelect={() => {
              optionsMetaModel.markUsed(id)
              options[id].action()
            }}
          />
        )
      }),
    ]
  }, [ids, contextOptions, metaData, options])

  return { items, options }
}

function makeContextOptions(search: string): Option[] {
  const searchDomain = getDomainFromSearch(search)
  const queryDomain = decodeURI(getSearchQuery())
  const results = [] as Option[]

  if (!searchDomain && !queryDomain) return results
  if (search && !searchDomain) return results

  const domain = searchDomain || queryDomain

  if (!location.pathname.startsWith('/analytics/overview/')) {
    results.push({
      id: 'go-to-domain-overview',
      name: `Open ${domain} in Domain Overview`,
      RenderName: () => (
        <span>
          Open <b>{domain}</b> in Domain Overview
        </span>
      ),
      icon: '✨',
      action: () => {
        window.open(
          `/analytics/overview/?searchType=domain&q=${encodeURI(domain)}`,
          '_self'
        )
      },
    })
  }

  if (!location.pathname.startsWith('/analytics/traffic/')) {
    results.push({
      id: 'go-to-traffic-analytics',
      name: `Open ${domain} in Traffic Analytics`,
      RenderName: () => (
        <span>
          Open <b>{domain}</b> in Traffic Analytics
        </span>
      ),
      icon: '✨',
      action: () => {
        window.open(
          `/analytics/traffic/overview/?q=${encodeURI(domain)}`,
          '_self'
        )
      },
    })
  }

  return results
}

/** Returns an domain + tld found in a given string.  */
function getDomainFromSearch(search: string) {
  const withDots = search
    .split(' ')
    .find(word => word.split('.').filter(Boolean).length > 1)
  if (!withDots) return null
  const domain = withDots
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .split('/')[0]
  if (!domain) return null
  return domain
}

/** Get "q" parameter from current location */
function getSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('q') || ''
}
