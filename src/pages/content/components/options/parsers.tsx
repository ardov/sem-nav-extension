import { Option } from '../CommandMenu/state'
import { toId } from '../shared/toId'

export function parseLeftMenu(): Option[] {
  const ids = [] as string[]
  const links = [
    ...document.getElementsByClassName('srf-report-sidebar-main__link'),
  ] as HTMLAnchorElement[]
  const filtered = links.filter(el => {
    const id = toId(el.innerText)
    if (ids.includes(id)) return false
    ids.push(id)
    return true
  })
  return filtered.map(el => ({
    id: toId(el.innerText),
    name: el.innerText,
    action: { type: 'goto', payload: el.href },
  }))
}

export function parseExtraTools(): Option[] {
  const parent = document.getElementById(
    'srf-dropdown-menu-extra-tools'
  ) as HTMLDivElement
  if (!parent) return []
  const links = [...parent.childNodes] as HTMLAnchorElement[]
  const filtered = links.filter(el => el.tagName === 'A')
  return filtered.map(el => ({
    id: toId(el.innerText),
    name: el.innerText,
    action: { type: 'goto', payload: el.href },
  }))
}

export function parseResources(): Option[] {
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
        id: toId(titleEl.innerText),
        name: titleEl.innerText,
        description: descriptionEl.innerText,
        action: { type: 'goto', payload: el.href },
      }
    })
}
