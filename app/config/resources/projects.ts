import type { ResourceConfig } from './types'
import { seoFields } from './seo'

export const projectResource: ResourceConfig = {
  name: 'projects',
  label: 'resources.projects.one',
  labelPlural: 'resources.projects.many',
  icon: 'pi pi-briefcase',
  columns: [
    { field: 'id', label: 'fields.id', sortable: true },
    { field: 'title', label: 'fields.title', sortable: true },
    { field: 'client', label: 'fields.client', sortable: true },
    { field: 'year', label: 'fields.year', sortable: true },
    { field: 'isPublished', label: 'fields.isPublished', type: 'boolean', sortable: true },
  ],
  fields: [
    { name: 'title', label: 'fields.title', type: 'text', required: true },
    { name: 'slug', label: 'fields.slug', type: 'text', help: 'form.slugHint' },
    { name: 'client', label: 'fields.client', type: 'text' },
    { name: 'type', label: 'fields.type', type: 'text' },
    { name: 'year', label: 'fields.year', type: 'number' },
    { name: 'description', label: 'fields.shortDescription', type: 'textarea' },
    { name: 'content', label: 'fields.contentHtml', type: 'richtext' },
    { name: 'imagePath', label: 'fields.image', type: 'image' },
    { name: 'position', label: 'fields.position', type: 'number' },
    { name: 'isPublished', label: 'fields.isPublished', type: 'boolean' },
    ...seoFields,
  ],
}
