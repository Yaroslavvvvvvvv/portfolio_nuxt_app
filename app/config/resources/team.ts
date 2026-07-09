import type { ResourceConfig } from './types'

export const teamResource: ResourceConfig = {
  name: 'team',
  label: 'resources.team.one',
  labelPlural: 'resources.team.many',
  icon: 'pi pi-users',
  columns: [
    { field: 'id', label: 'fields.id', sortable: true },
    { field: 'name', label: 'fields.name', sortable: true },
    { field: 'role', label: 'fields.role', sortable: true },
    { field: 'position', label: 'fields.position', sortable: true },
    { field: 'isPublished', label: 'fields.isPublished', type: 'boolean', sortable: true },
  ],
  fields: [
    { name: 'name', label: 'fields.name', type: 'text', required: true },
    { name: 'slug', label: 'fields.slug', type: 'text', help: 'form.slugHint' },
    { name: 'role', label: 'fields.role', type: 'text' },
    { name: 'bio', label: 'fields.bio', type: 'textarea' },
    { name: 'imagePath', label: 'fields.photo', type: 'text' },
    { name: 'position', label: 'fields.position', type: 'number' },
    { name: 'isPublished', label: 'fields.isPublished', type: 'boolean' },
  ],
}
