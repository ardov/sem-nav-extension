export function cmdStroke(key: string) {
  const isMac = navigator.userAgent.toLowerCase().indexOf('mac') !== -1
  return isMac ? `⌘${key}` : `Ctrl + ${key}`
}
