import type { ResourceField } from './types'

// Per-page SEO overrides, shared by every resource with a public detail route.
// All optional: when blank the page falls back to the record's own title and
// description, so an editor can ignore this block entirely.
export const seoFields: ResourceField[] = [
  { name: 'metaTitle', label: 'fields.metaTitle', type: 'text', help: 'form.metaTitleHint' },
  { name: 'metaDescription', label: 'fields.metaDescription', type: 'textarea', help: 'form.metaDescriptionHint' },
  { name: 'ogImage', label: 'fields.ogImage', type: 'image', help: 'form.ogImageHint' },
]
