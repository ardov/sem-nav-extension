/** Returns a promise for an element that may not exist yet */
export function getElement<T>(getter: () => T, waitLimit = 10_000): Promise<T> {
  const INTERVAL = 300
  const start = Date.now()
  return new Promise<T>(resolve => {
    let el = getter()
    if (el) return resolve(el)
    const timer = setInterval(() => {
      el = getter()
      if (el) {
        clearInterval(timer)
        resolve(el)
      }
      if (Date.now() - start > waitLimit) {
        clearInterval(timer)
        resolve(null)
      }
    }, INTERVAL)
  })
}
