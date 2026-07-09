import { prisma } from './prisma'

// Prisma model delegates need `any` args to be assignable to a shared shape.
interface ReadDelegate {
  findMany: (args: any) => Promise<any[]>
  findFirst: (args: any) => Promise<any>
}

interface PublicCfg {
  delegate: ReadDelegate
  order: Record<string, 'asc' | 'desc'>
  hasSlug?: boolean
}

// Public (read-only, published-only) view of the same resources.
export const publicRegistry: Record<string, PublicCfg> = {
  blog: { delegate: prisma.blog, order: { createdAt: 'desc' }, hasSlug: true },
  projects: { delegate: prisma.project, order: { position: 'asc' }, hasSlug: true },
  services: { delegate: prisma.service, order: { position: 'asc' }, hasSlug: true },
  team: { delegate: prisma.teamMember, order: { position: 'asc' }, hasSlug: true },
  faq: { delegate: prisma.faq, order: { position: 'asc' } },
  pages: { delegate: prisma.staticPage, order: { createdAt: 'desc' }, hasSlug: true },
}

export function getPublicCfg(name: string): PublicCfg {
  const cfg = publicRegistry[name]
  if (!cfg) throw createError({ statusCode: 404, statusMessage: `Unknown resource "${name}"` })
  return cfg
}
