export type Link = {
  type: 'tool' | 'extra-tool' | 'resource' | 'app' | 'other'
  id: string
  name: string
  url: string
  status?: 'beta' | 'new'
  projectUrl?: string
  description?: string
  tags?: string[]
  iconUrl?: string
  developer?: string
}
