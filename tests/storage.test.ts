import { describe, it, expect } from 'vitest'
import { sniffImageMime, extensionFor } from '../server/utils/storage'

// Uploads are trusted by their bytes, never by the client-supplied Content-Type.
function png(): Buffer {
  return Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
}

describe('sniffImageMime', () => {
  it('detects the formats we accept', () => {
    expect(sniffImageMime(png())).toBe('image/png')
    expect(sniffImageMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg')
    expect(sniffImageMime(Buffer.from('GIF89a...'))).toBe('image/gif')
    expect(sniffImageMime(Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]))).toBe('image/webp')
    expect(sniffImageMime(Buffer.concat([Buffer.alloc(4), Buffer.from('ftypavif')]))).toBe('image/avif')
  })

  it('rejects SVG — it can carry <script> and we serve from our own origin', () => {
    expect(sniffImageMime(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBeNull()
  })

  it('rejects a script disguised with an image extension', () => {
    expect(sniffImageMime(Buffer.from('<?php system($_GET["c"]); ?>'))).toBeNull()
  })

  it('rejects empty and truncated input', () => {
    expect(sniffImageMime(Buffer.alloc(0))).toBeNull()
    expect(sniffImageMime(Buffer.from([0x89, 0x50]))).toBeNull()
  })

  it('maps every detected type to an extension', () => {
    for (const mime of ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']) {
      expect(extensionFor(mime)).toBeTruthy()
    }
    expect(extensionFor('image/svg+xml')).toBeUndefined()
  })
})
