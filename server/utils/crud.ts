import type { H3Event } from 'h3'

// Generic CRUD engine shared by every admin resource.
// A resource is described once (see server/utils/resources.ts) and these
// helpers turn that description into list/show/create/update/destroy behaviour.
export interface CrudConfig {
  // Prisma model delegate, e.g. prisma.news
  delegate: {
    count: (args: any) => Promise<number>
    findMany: (args: any) => Promise<any[]>
    findUnique: (args: any) => Promise<any>
    create: (args: any) => Promise<any>
    update: (args: any) => Promise<any>
    delete: (args: any) => Promise<any>
  }
  searchable?: string[]
  fillable: string[]
  defaultSort?: { field: string; order: 'asc' | 'desc' }
  transform?: (data: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>
  // Optional yup schema — validated server-side on create/update (defence in depth).
  schema?: { validate: (data: any, opts?: any) => Promise<any> }
}

async function validateData(cfg: CrudConfig, data: Record<string, any>) {
  if (!cfg.schema) return
  try {
    await cfg.schema.validate(data, { abortEarly: false })
  } catch {
    throw createError({ statusCode: 422, statusMessage: 'server.invalidData' })
  }
}

function pick(source: Record<string, any>, keys: string[]): Record<string, any> {
  const out: Record<string, any> = {}
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key]
  }
  return out
}

// Turn known Prisma errors into friendly HTTP errors for the form to display.
function mapWriteError(err: any) {
  if (err?.code === 'P2002') {
    return createError({ statusCode: 422, statusMessage: 'server.duplicate' })
  }
  if (err?.code === 'P2025') {
    return createError({ statusCode: 404, statusMessage: 'server.notFound' })
  }
  return err
}

// Columns a client may sort by: the resource's own fields plus the timestamps
// every model shares. An unknown field would make Prisma throw a 500, so it
// falls back to the resource default instead.
function resolveSortField(cfg: CrudConfig, requested: unknown): string {
  const fallback = cfg.defaultSort?.field ?? 'id'
  if (typeof requested !== 'string') return fallback
  const allowed = new Set([...cfg.fillable, 'id', 'createdAt', 'updatedAt'])
  return allowed.has(requested) ? requested : fallback
}

export async function crudList(event: H3Event, cfg: CrudConfig) {
  const q = getQuery(event)
  const page = Math.max(1, Number(q.page ?? 1))
  const perPage = Math.min(100, Math.max(1, Number(q.perPage ?? 10)))
  const search = String(q.search ?? '').trim()
  const sortField = resolveSortField(cfg, q.sortField)
  const sortOrder = q.sortOrder === 'asc' || q.sortOrder === 'desc'
    ? q.sortOrder
    : (cfg.defaultSort?.order ?? 'desc')

  const where = search && cfg.searchable?.length
    ? { OR: cfg.searchable.map((f) => ({ [f]: { contains: search, mode: 'insensitive' } })) }
    : {}

  const [total, rows] = await Promise.all([
    cfg.delegate.count({ where }),
    cfg.delegate.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ])

  return { rows, total, page, perPage }
}

export async function crudShow(event: H3Event, cfg: CrudConfig) {
  const id = Number(getRouterParam(event, 'id'))
  const row = await cfg.delegate.findUnique({ where: { id } })
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return row
}

export async function crudCreate(event: H3Event, cfg: CrudConfig) {
  const body = await readBody(event)
  let data = pick(body, cfg.fillable)
  if (cfg.transform) data = await cfg.transform(data)
  await validateData(cfg, data)
  try {
    return await cfg.delegate.create({ data })
  } catch (err) {
    throw mapWriteError(err)
  }
}

export async function crudUpdate(event: H3Event, cfg: CrudConfig) {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  let data = pick(body, cfg.fillable)
  if (cfg.transform) data = await cfg.transform(data)
  await validateData(cfg, data)
  try {
    return await cfg.delegate.update({ where: { id }, data })
  } catch (err) {
    throw mapWriteError(err)
  }
}

export async function crudDestroy(event: H3Event, cfg: CrudConfig) {
  const id = Number(getRouterParam(event, 'id'))
  await cfg.delegate.delete({ where: { id } })
  return { ok: true }
}

export async function crudToggleField(event: H3Event, cfg: CrudConfig) {
  const id = Number(getRouterParam(event, 'id'))
  const { field, value } = await readBody(event)
  if (!cfg.fillable.includes(field)) {
    throw createError({ statusCode: 422, statusMessage: `Field "${field}" is not editable` })
  }
  return cfg.delegate.update({ where: { id }, data: { [field]: value } })
}
