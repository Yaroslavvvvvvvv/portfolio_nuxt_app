export type FieldType = 'text' | 'textarea' | 'boolean' | 'number' | 'list' | 'image' | 'richtext'

export interface ResourceField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
  // Extra props spread onto the underlying PrimeVue input (e.g. { maxFractionDigits: 1 }).
  props?: Record<string, any>
}

export interface ResourceColumn {
  field: string
  label: string
  sortable?: boolean
  type?: 'text' | 'boolean' | 'date'
}

// A resource is described ONCE here; the generic table/form/API components
// turn this description into a full CRUD screen.
export interface ResourceConfig {
  name: string // route + api segment, e.g. 'news'
  label: string // singular label
  labelPlural: string
  icon?: string // primeicon class, e.g. 'pi pi-book'
  creatable?: boolean // false = read-only inbox (no Add button / create page), e.g. form submissions
  columns: ResourceColumn[]
  fields: ResourceField[]
}
