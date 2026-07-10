import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { AwsClient } from 'aws4fetch'

// Where uploaded images live. One interface, two drivers: the local disk for
// development, S3-compatible object storage (Cloudflare R2, Backblaze B2) for
// production — a container's filesystem is ephemeral and loses files on redeploy.
export interface StorageDriver {
  /** Store the bytes and return the public path or URL to render. */
  put(key: string, data: Buffer, contentType: string): Promise<string>
}

// SVG is deliberately absent: it can carry <script>, and these files are served
// from our own origin.
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

// Background video for the home hero. Both are inert containers — unlike SVG,
// neither can execute script in the browser.
const VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

const ALLOWED: Record<string, string> = { ...IMAGE_TYPES, ...VIDEO_TYPES }

export type UploadKind = 'image' | 'video'

// Video is two orders of magnitude heavier than a photo, so the limits differ.
// Keep the video ceiling low enough that a hero clip stays watchable on mobile.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_BYTES = 64 * 1024 * 1024

export function maxBytesFor(kind: UploadKind): number {
  return kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
}

function startsWith(buf: Buffer, bytes: number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false
  return bytes.every((b, i) => buf[offset + i] === b)
}

// ISO-BMFF containers (mp4, avif, heic, …) all start with a `ftyp` box whose
// major brand names the actual format. Whitelist the video brands rather than
// excluding the image ones: a brand we have never heard of must not pass.
const MP4_BRANDS = new Set([
  'isom', 'iso2', 'iso4', 'iso5', 'iso6',
  'mp41', 'mp42', 'avc1', 'dash', 'mmp4', 'M4V ',
])

function ftypBrand(buf: Buffer): string | null {
  if (buf.subarray(4, 8).toString('ascii') !== 'ftyp') return null
  return buf.subarray(8, 12).toString('ascii')
}

// Trust the bytes, not the client-supplied Content-Type. Returns the real MIME
// type, or null when the file is not one of the formats we accept.
export function sniffImageMime(buf: Buffer): string | null {
  if (startsWith(buf, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return 'image/gif'
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp'
  }
  if (ftypBrand(buf)?.startsWith('avif')) return 'image/avif'
  return null
}

export function sniffVideoMime(buf: Buffer): string | null {
  // Matroska/WebM: EBML header.
  if (startsWith(buf, [0x1a, 0x45, 0xdf, 0xa3])) return 'video/webm'
  const brand = ftypBrand(buf)
  if (brand && MP4_BRANDS.has(brand)) return 'video/mp4'
  return null
}

// The caller says which kind of file it asked for; a video must never satisfy an
// image field, nor the other way round.
export function sniffUploadMime(buf: Buffer, kind: UploadKind): string | null {
  return kind === 'video' ? sniffVideoMime(buf) : sniffImageMime(buf)
}

export function extensionFor(mime: string): string | undefined {
  return ALLOWED[mime]
}

// Grouped by month so a long-lived bucket stays browsable.
export function buildKey(mime: string): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `${yyyy}/${mm}/${randomUUID()}.${extensionFor(mime)}`
}

function localDriver(uploadDir: string): StorageDriver {
  const root = resolve(uploadDir)
  return {
    async put(key, data) {
      const target = join(root, key)
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, data)
      // Served by server/routes/uploads/[...path].get.ts
      return `/uploads/${key}`
    },
  }
}

interface S3Options {
  endpoint: string
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  /** Public origin the bucket is exposed on (R2 custom domain, CDN, …). */
  publicUrl: string
}

function s3Driver(opts: S3Options): StorageDriver {
  const missing = (['endpoint', 'bucket', 'accessKeyId', 'secretAccessKey', 'publicUrl'] as const)
    .filter((k) => !opts[k])
  if (missing.length) {
    throw new Error(`Storage driver "s3" is missing config: ${missing.join(', ')}`)
  }

  const client = new AwsClient({
    accessKeyId: opts.accessKeyId,
    secretAccessKey: opts.secretAccessKey,
    region: opts.region || 'auto',
    service: 's3',
  })
  const base = `${opts.endpoint.replace(/\/$/, '')}/${opts.bucket}`

  return {
    async put(key, data, contentType) {
      const res = await client.fetch(`${base}/${key}`, {
        method: 'PUT',
        body: new Uint8Array(data),
        headers: { 'content-type': contentType, 'cache-control': 'public, max-age=31536000, immutable' },
      })
      if (!res.ok) {
        throw new Error(`S3 upload failed: ${res.status} ${await res.text()}`)
      }
      return `${opts.publicUrl.replace(/\/$/, '')}/${key}`
    },
  }
}

export function useStorage(): StorageDriver {
  const cfg = useRuntimeConfig().storage
  if (cfg.driver === 's3') {
    return s3Driver({
      endpoint: cfg.s3Endpoint,
      bucket: cfg.s3Bucket,
      region: cfg.s3Region,
      accessKeyId: cfg.s3AccessKeyId,
      secretAccessKey: cfg.s3SecretAccessKey,
      publicUrl: cfg.s3PublicUrl,
    })
  }
  return localDriver(cfg.uploadDir)
}
