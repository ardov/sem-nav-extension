import data from './links.json'

type DataType = typeof data

export type LinkId = keyof DataType['links']
export type CollectionId = keyof DataType['collections']
export type Status = 'new' | 'beta'
export type LinkType = 'tool' | 'app' | 'extra-tool' | 'resource' | 'other'

export type Link = {
  id: LinkId
  name: string
  type: LinkType
  url: string
  description?: string
  developer?: string
  iconUrl?: string
  collections?: CollectionId[]
  status?: Status
  projectUrl?: string
}

export type LinkCollection = {
  id: CollectionId
  name: string
  description?: string
  sub_links?: LinkId[]
  sub_collections?: CollectionId[]
  sub_collection_links?: LinkId[]
}

export const links = {
  byId: data.links as Record<LinkId, Link>,
  list: Object.values(data.links) as Link[],
}

export const collections = {
  byId: data.collections as Record<CollectionId, LinkCollection>,
  list: Object.values(data.collections) as LinkCollection[],
}
