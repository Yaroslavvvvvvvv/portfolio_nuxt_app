import type { ResourceConfig } from './types'

export const serviceResource: ResourceConfig = {
  name: 'services',
  label: 'resources.services.one',
  labelPlural: 'resources.services.many',
  icon: 'pi pi-th-large',
  columns: [
    { field: 'id', label: 'fields.id', sortable: true },
    { field: 'title', label: 'fields.title', sortable: true },
    { field: 'position', label: 'fields.position', sortable: true },
    { field: 'isPublished', label: 'fields.isPublished', type: 'boolean', sortable: true },
  ],
  fields: [
    { name: 'title', label: 'fields.title', type: 'text', required: true },
    { name: 'slug', label: 'fields.slug', type: 'text', help: 'form.slugHint' },
    { name: 'description', label: 'fields.shortDescription', type: 'textarea' },
    { name: 'content', label: 'fields.contentHtml', type: 'textarea' },
    { name: 'icon', label: 'fields.icon', type: 'text', help: 'form.iconHint' },
    { name: 'position', label: 'fields.position', type: 'number' },
    { name: 'isPublished', label: 'fields.isPublished', type: 'boolean' },
  ],
}
