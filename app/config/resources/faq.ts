import type { ResourceConfig } from './types'

export const faqResource: ResourceConfig = {
  name: 'faq',
  label: 'resources.faq.one',
  labelPlural: 'resources.faq.many',
  icon: 'pi pi-question-circle',
  columns: [
    { field: 'id', label: 'fields.id', sortable: true },
    { field: 'question', label: 'fields.question', sortable: true },
    { field: 'position', label: 'fields.position', sortable: true },
    { field: 'isPublished', label: 'fields.isPublished', type: 'boolean', sortable: true },
  ],
  fields: [
    { name: 'question', label: 'fields.question', type: 'text', required: true },
    { name: 'answer', label: 'fields.answer', type: 'textarea', required: true },
    { name: 'position', label: 'fields.position', type: 'number' },
    { name: 'isPublished', label: 'fields.isPublished', type: 'boolean' },
  ],
}
