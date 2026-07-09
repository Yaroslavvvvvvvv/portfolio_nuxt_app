import * as yup from 'yup'
import type { CrudConfig } from './crud'
import { prisma } from './prisma'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '')
}

function slugFrom(source: string) {
  return (data: Record<string, any>) => {
    if (data[source] && !data.slug) data.slug = slugify(data[source])
    if (typeof data.slug === 'string' && data.slug) data.slug = slugify(data.slug)
    return data
  }
}

const withTitleSlug = slugFrom('title')

const titleRequired = yup.object({ title: yup.string().trim().required() })

// Central registry: resource name -> how the generic CRUD engine talks to Prisma.
export const crudRegistry: Record<string, CrudConfig> = {
  blog: {
    delegate: prisma.blog,
    searchable: ['title', 'slug'],
    fillable: ['title', 'slug', 'shortDescription', 'content', 'tags', 'imagePath', 'isPublished'],
    defaultSort: { field: 'createdAt', order: 'desc' },
    transform: withTitleSlug,
    schema: titleRequired,
  },
  projects: {
    delegate: prisma.project,
    searchable: ['title', 'slug', 'client'],
    fillable: ['title', 'slug', 'client', 'type', 'year', 'description', 'content', 'imagePath', 'position', 'isPublished'],
    defaultSort: { field: 'position', order: 'asc' },
    transform: withTitleSlug,
    schema: titleRequired,
  },
  services: {
    delegate: prisma.service,
    searchable: ['title', 'slug'],
    fillable: ['title', 'slug', 'description', 'content', 'icon', 'position', 'isPublished'],
    defaultSort: { field: 'position', order: 'asc' },
    transform: withTitleSlug,
    schema: titleRequired,
  },
  team: {
    delegate: prisma.teamMember,
    searchable: ['name', 'slug', 'role'],
    fillable: ['name', 'slug', 'role', 'bio', 'imagePath', 'position', 'isPublished'],
    defaultSort: { field: 'position', order: 'asc' },
    transform: slugFrom('name'),
    schema: yup.object({ name: yup.string().trim().required() }),
  },
  faq: {
    delegate: prisma.faq,
    searchable: ['question', 'answer'],
    fillable: ['question', 'answer', 'position', 'isPublished'],
    defaultSort: { field: 'position', order: 'asc' },
    schema: yup.object({
      question: yup.string().trim().required(),
      answer: yup.string().trim().required(),
    }),
  },
  pages: {
    delegate: prisma.staticPage,
    searchable: ['title', 'slug'],
    fillable: ['title', 'slug', 'content', 'isPublished'],
    defaultSort: { field: 'createdAt', order: 'desc' },
    transform: withTitleSlug,
    schema: titleRequired,
  },
  requests: {
    delegate: prisma.contactRequest,
    searchable: ['name', 'email', 'message'],
    fillable: ['name', 'email', 'message', 'isRead'],
    defaultSort: { field: 'createdAt', order: 'desc' },
  },
}

export function getCrud(name: string): CrudConfig {
  const cfg = crudRegistry[name]
  if (!cfg) throw createError({ statusCode: 404, statusMessage: `Unknown resource "${name}"` })
  return cfg
}
