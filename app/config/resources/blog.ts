import type { ResourceConfig } from './types'
import { seoFields } from './seo'

export const blogResource: ResourceConfig = {
  name: 'blog',
  label: 'resources.blog.one',
  labelPlural: 'resources.blog.many',
  icon: 'pi pi-book',
  columns: [
    { field: 'id', label: 'fields.id', sortable: true },
    { field: 'title', label: 'fields.title', sortable: true },
    { field: 'slug', label: 'fields.slug', sortable: true },
    { field: 'isPublished', label: 'fields.isPublished', type: 'boolean', sortable: true },
  ],
  fields: [
    { name: 'title', label: 'fields.title', type: 'text', required: true },
    { name: 'slug', label: 'fields.slug', type: 'text', help: 'form.slugHint' },
    { name: 'shortDescription', label: 'fields.shortDescription', type: 'textarea' },
    { name: 'content', label: 'fields.contentHtml', type: 'richtext' },
    { name: 'tags', label: 'fields.tags', type: 'list' },
    { name: 'imagePath', label: 'fields.image', type: 'image' },
    { name: 'isPublished', label: 'fields.isPublished', type: 'boolean' },
    ...seoFields,
  ],
}
