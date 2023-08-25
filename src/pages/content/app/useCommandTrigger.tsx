import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { cmdStroke } from '@src/shared/cmdStroke'
import { menuVisibility } from '@src/model/menuVisibility'
import { settings } from '@src/model/userSettings'

/** Add a button to the menu to open command menu */
export function useCommandTrigger() {
  const userSettings = useStore(settings.store)
  const { openKey, showTrigger } = userSettings

  useEffect(() => {
    if (!showTrigger) return
    return addTrigger()

    function addTrigger() {
      const trigger = makeTrigger(openKey)
      let ulRoot = getRoot()

      // Happy path - we have the root element
      if (ulRoot) {
        ulRoot.insertBefore(trigger, ulRoot.firstChild)
        return () => ulRoot.removeChild(trigger)
      }

      // If we don't have the root element, wait for it to appear
      const start = Date.now()
      const waitLimit = 10000 // 10 seconds
      const timer = setInterval(() => {
        ulRoot = getRoot()
        if (ulRoot) {
          clearInterval(timer)
          ulRoot.insertBefore(trigger, ulRoot.firstChild)
        }
        if (Date.now() - start > waitLimit) clearInterval(timer)
      }, 500)

      return () => {
        clearInterval(timer)
        if (ulRoot) ulRoot.removeChild(trigger)
      }
    }
  }, [openKey, showTrigger])
}
function getRoot() {
  return document.getElementsByClassName(
    'srf-report-sidebar-main'
  )[0] as HTMLElement
}
function makeTrigger(key: string) {
  const wrapper = document.createElement('div')
  wrapper.className = 'snav-trigger-wrapper'
  const btn = document.createElement('button')
  btn.className = 'snav-trigger'
  btn.innerHTML = `Search (${cmdStroke(key.toUpperCase())})`
  btn.onclick = menuVisibility.toggle
  wrapper.appendChild(btn)
  return wrapper
}
