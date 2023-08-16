class ElementToggler {
  constructor(
    private element: HTMLElement,
    private key: string
  ) {
    this.init()
  }
  get visible() {
    return this.element.style.display !== 'none'
  }
  hide() {
    this.element.style.display = 'none'
    chrome.storage.local.set({ [this.key]: false })
  }
  show() {
    this.element.style.display = 'block'
    chrome.storage.local.set({ [this.key]: true })
  }
  async init() {
    const result = await chrome.storage.local.get([this.key])
    if (result[this.key] === false) this.hide()
  }
  toggle() {
    if (this.visible) this.hide()
    else this.show()
  }
}

export const footer = new ElementToggler(
  document.getElementsByClassName('srf-layout__footer')[0] as HTMLDivElement,
  'showFooter'
)
export const menu = new ElementToggler(
  document.getElementsByClassName('srf-layout__sidebar')[0] as HTMLDivElement,
  'showMenu'
)

chrome.storage.onChanged.addListener(changes => {
  for (const key in changes) {
    if (key === 'showFooter') {
      if (changes[key].newValue) footer.show()
      else footer.hide()
    } else if (key === 'showMenu') {
      if (changes[key].newValue) menu.show()
      else menu.hide()
    }
  }
})
