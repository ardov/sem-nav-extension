import type { Link } from './types'
import { toId } from '../toId'

export function parseLeftMenu(): Link[] {
  const ids = [] as string[]
  const links = [
    ...document.getElementsByClassName('srf-report-sidebar-main__link'),
  ] as HTMLAnchorElement[]
  const uniqueLinks = links.filter(el => {
    const id = toId(el.innerText)
    if (ids.includes(id)) return false
    ids.push(id)
    return true
  })
  return uniqueLinks.map(el => ({
    type: 'tool',
    id: toId(el.innerText),
    name: el.innerText,
    url: el.href,
  }))
}

export function parseExtraTools(): Link[] {
  const parent = document.getElementById(
    'srf-dropdown-menu-extra-tools'
  ) as HTMLDivElement
  if (!parent) return []
  const links = [...parent.childNodes] as HTMLAnchorElement[]
  return links
    .filter(el => el.tagName === 'A')
    .map(el => ({
      type: 'extra-tool',
      id: toId(el.innerText),
      name: el.innerText,
      url: el.href,
    }))
}

export function parseResources(): Link[] {
  const parent = document.getElementById(
    'srf-dropdown-menu-resources'
  ) as HTMLDivElement
  if (!parent) return []
  const links = [...parent.childNodes] as HTMLAnchorElement[]

  return links
    .filter(el => el.tagName === 'A')
    .map(el => {
      const titleEl = el.getElementsByClassName(
        'srf-dropdown-menu-grid-item__title'
      )[0] as HTMLDivElement
      const descriptionEl = el.getElementsByClassName(
        'srf-dropdown-menu-grid-item__text'
      )[0] as HTMLDivElement
      return {
        type: 'resource',
        id: toId(titleEl.innerText),
        name: titleEl.innerText,
        description: descriptionEl.innerText,
        url: el.href,
      }
    })
}
