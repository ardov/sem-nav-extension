import { CommandMenu } from './CommandMenu'
import { useCommandTrigger } from './useCommandTrigger'

export default function App() {
  useCommandTrigger()
  return <CommandMenu />
}
