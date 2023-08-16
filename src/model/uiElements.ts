class ElementToggler {
  constructor(private element: HTMLElement) {}
  get visible() {
    return this.element.style.display !== 'none'
  }
  hide() {
    this.element.style.display = 'none'
  }
  show() {
    this.element.style.display = 'block'
  }
}

export const footer = new ElementToggler(
  document.getElementsByClassName('srf-layout__footer')[0] as HTMLDivElement
)
export const menu = new ElementToggler(
  document.getElementsByClassName('srf-layout__sidebar')[0] as HTMLDivElement
)
