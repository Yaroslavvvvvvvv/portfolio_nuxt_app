import type { ResourceConfig } from './types'

// Contact form submissions — a read-only inbox (no admin-side create).
export const requestResource: ResourceConfig = {
  name: 'requests',
  label: 'resources.requests.one',
  labelPlural: 'resources.requests.many',
  icon: 'pi pi-inbox',
  creatable: false,
  columns: [
    { field: 'name', label: 'fields.name', sortable: true },
    { field: 'email', label: 'fields.email', sortable: true },
    { field: 'message', label: 'fields.message' },
    { field: 'isRead', label: 'fields.isRead', type: 'boolean', sortable: true },
    { field: 'createdAt', label: 'fields.createdAt', type: 'date', sortable: true },
  ],
  fields: [
    { name: 'name', label: 'fields.name', type: 'text' },
    { name: 'email', label: 'fields.email', type: 'text' },
    { name: 'message', label: 'fields.message', type: 'textarea' },
    { name: 'isRead', label: 'fields.isRead', type: 'boolean' },
  ],
}
