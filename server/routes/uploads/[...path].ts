import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

// Serves files written by the local storage driver. The S3 driver returns
// absolute URLs on its own origin, so this route is only used in local mode.
const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

export default defineEventHandler(async (event) => {
  // Read-only route. HEAD matters for CDNs and uptime checks, so it is handled
  // alongside GET rather than via a `.get.ts` suffix (which 404s on HEAD).
  if (event.method !== 'GET' && event.method !== 'HEAD') {
    throw createError({ statusCode: 405 })
  }

  const cfg = useRuntimeConfig().storage
  if (cfg.driver !== 'local') throw createError({ statusCode: 404 })

  const relative = decodeURIComponent(getRouterParam(event, 'path') || '')
  const root = resolve(cfg.uploadDir)
  const target = resolve(root, relative)

  // Reject anything that escapes the upload root (e.g. "../../.env").
  if (target !== root && !target.startsWith(root + sep)) {
    throw createError({ statusCode: 403 })
  }

  const type = MIME[extname(target).toLowerCase()]
  if (!type) throw createError({ statusCode: 404 })

  const info = await stat(target).catch(() => null)
  if (!info?.isFile()) throw createError({ statusCode: 404 })

  setHeader(event, 'content-type', type)
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return readFile(target)
})
