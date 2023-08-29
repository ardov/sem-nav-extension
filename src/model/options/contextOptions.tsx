import React from 'react'
import { Option } from '@src/model/options/staticOptions'

export function makeContextOptions(search: string): Option[] {
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
      type: 'action',
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
      type: 'action',
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
