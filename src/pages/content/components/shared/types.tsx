export type Link = {
  type: 'tool' | 'extra-tool' | 'resource'
  id: string
  name: string
  url: string
  status?: 'beta' | 'new'
  projectUrl?: string
  description?: string
  tags?: string[]
  icon?: string
}
