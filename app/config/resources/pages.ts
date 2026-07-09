import type { ResourceConfig } from './types'
import { seoFields } from './seo'

export const pageResource: ResourceConfig = {
  name: 'pages',
  label: 'resources.pages.one',
  labelPlural: 'resources.pages.many',
  icon: 'pi pi-file',
  columns: [
    { field: 'id', label: 'fields.id', sortable: true },
    { field: 'title', label: 'fields.title', sortable: true },
    { field: 'slug', label: 'fields.slug', sortable: true },
    { field: 'isPublished', label: 'fields.isPublished', type: 'boolean', sortable: true },
  ],
  fields: [
    { name: 'title', label: 'fields.title', type: 'text', required: true },
    { name: 'slug', label: 'fields.slug', type: 'text', help: 'form.slugHint' },
    { name: 'content', label: 'fields.contentHtml', type: 'richtext' },
    { name: 'isPublished', label: 'fields.isPublished', type: 'boolean' },
    ...seoFields,
  ],
}
