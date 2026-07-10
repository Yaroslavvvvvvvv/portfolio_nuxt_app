import { createReadStream } from 'node:fs'
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
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

// Parse a single-range `Range: bytes=start-end` header against a known file size.
// Multi-range requests are rare and clients fall back gracefully, so anything we
// cannot parse is treated as "no range" rather than an error.
//
// Returns undefined to serve the whole file, null when the range is unsatisfiable.
function parseRange(header: string | undefined, size: number): { start: number; end: number } | null | undefined {
  if (!header) return undefined
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!match) return undefined

  const [, rawStart, rawEnd] = match
  if (!rawStart && !rawEnd) return undefined

  // A suffix range, `bytes=-500`, asks for the last 500 bytes.
  const start = rawStart ? Number(rawStart) : Math.max(0, size - Number(rawEnd))
  const end = rawStart ? (rawEnd ? Math.min(Number(rawEnd), size - 1) : size - 1) : size - 1

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) return null
  return { start, end }
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
  // Announced for every file: without it Safari refuses to start a <video> at
  // all, and no client offers seeking.
  setHeader(event, 'accept-ranges', 'bytes')

  const range = parseRange(getRequestHeader(event, 'range'), info.size)

  if (range === null) {
    setHeader(event, 'content-range', `bytes */${info.size}`)
    throw createError({ statusCode: 416, statusMessage: 'Range Not Satisfiable' })
  }

  // A HEAD reply must carry the same status and headers as the GET it stands
  // for, only without the body. Returning `null` here would make h3 answer 204
  // and drop content-length, which breaks CDNs and uptime checks.
  const endWithoutBody = () => {
    event.node.res.end()
  }

  if (range) {
    setResponseStatus(event, 206)
    setHeader(event, 'content-range', `bytes ${range.start}-${range.end}/${info.size}`)
    setHeader(event, 'content-length', range.end - range.start + 1)
    if (event.method === 'HEAD') return endWithoutBody()
    return sendStream(event, createReadStream(target, { start: range.start, end: range.end }))
  }

  setHeader(event, 'content-length', info.size)
  if (event.method === 'HEAD') return endWithoutBody()
  // A video requested without a Range header (curl, some crawlers) is streamed
  // rather than held in memory; images stay a plain buffered read.
  if (type.startsWith('video/')) return sendStream(event, createReadStream(target))
  return readFile(target)
})
