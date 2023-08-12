import React from 'react'
import { Command } from 'cmdk'
import { useAppReducer } from './useActions'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
  const [state, dispatch] = useAppReducer()

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command.Dialog
      value={value}
      onValueChange={v => setValue(v)}
      loop
      open={open}
      onOpenChange={setOpen}
    >
      <div className="snav-header">
        <Command.Input autoFocus placeholder="What are you looking for?" />
        <SearchIcon className="snav-search-icon" />
      </div>

      <div className="snav-content">
        <div className="snav-list">
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            {state.options.map(option => {
              return (
                <Command.Item
                  key={option.id}
                  value={option.id}
                  onSelect={() => dispatch(option.action)}
                >
                  {option.name}
                </Command.Item>
              )
            })}
          </Command.List>
        </div>
        <div className="snav-details">{value}</div>
      </div>
    </Command.Dialog>
  )
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="m14.7 13.3-4.5-4.6a5 5 0 1 0-1.5 1.5l4.6 4.5a1 1 0 0 0 1.6-1 1 1 0 0 0-.2-.4ZM3 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
    />
  </svg>
)
