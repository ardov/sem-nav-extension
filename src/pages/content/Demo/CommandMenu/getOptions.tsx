import { Option } from './state'

function parseLeftMenu(): Option[] {
  const ids = [] as string[]
  const links = [
    ...document.getElementsByClassName('srf-report-sidebar-main__link'),
  ] as HTMLAnchorElement[]

  return links
    .filter(el => {
      const id = toId(el.innerText)
      if (ids.includes(id)) return false
      ids.push(id)
      return true
    })
    .map(el => ({
      id: toId(el.innerText),
      name: el.innerText,
      action: { type: 'goto', payload: el.href },
    }))

  function toId(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
  }
}

function parseExtraTools(): Option[] {
  const parent = document.getElementById(
    'srf-dropdown-menu-extra-tools'
  ) as HTMLDivElement
  if (!parent) return []
  const links = [...parent.childNodes] as HTMLAnchorElement[]

  return links
    .filter(el => {
      if (el.tagName !== 'A') return false
      return true
    })
    .map(el => ({
      id: toId(el.innerText),
      name: el.innerText,
      action: { type: 'goto', payload: el.href },
    }))

  function toId(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
  }
}

function parseResources(): Option[] {
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

  function toId(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
  }
}

export function getOptions() {
  const leftMenu = parseLeftMenu()
  const extraTools = parseExtraTools()
  const resources = parseResources()
  return [...leftMenu, ...extraTools, ...resources]
}
// export async function getOptions(): Promise<Option[]> {
//   const options = getMenuTools()
//   return options
// }
