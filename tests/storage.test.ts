import { describe, it, expect } from 'vitest'
import {
  sniffImageMime,
  sniffVideoMime,
  sniffUploadMime,
  extensionFor,
  maxBytesFor,
} from '../server/utils/storage'

// Uploads are trusted by their bytes, never by the client-supplied Content-Type.
function png(): Buffer {
  return Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
}

// ISO-BMFF: 4 bytes of box size, then 'ftyp', then the major brand.
function ftyp(brand: string): Buffer {
  return Buffer.concat([Buffer.alloc(4), Buffer.from('ftyp'), Buffer.from(brand)])
}

function webm(): Buffer {
  return Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0])
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

  it('rejects video — an image field must never accept one', () => {
    expect(sniffImageMime(ftyp('isom'))).toBeNull()
    expect(sniffImageMime(webm())).toBeNull()
  })
})

describe('sniffVideoMime', () => {
  it('detects mp4 by its major brand and webm by its EBML header', () => {
    expect(sniffVideoMime(webm())).toBe('video/webm')
    for (const brand of ['isom', 'iso2', 'mp42', 'avc1', 'dash']) {
      expect(sniffVideoMime(ftyp(brand))).toBe('video/mp4')
    }
  })

  // avif and heic are ISO-BMFF too: a brand whitelist keeps them out, an
  // "anything with ftyp that isn't avif" check would let heic through.
  it('rejects other ISO-BMFF containers', () => {
    expect(sniffVideoMime(ftyp('avif'))).toBeNull()
    expect(sniffVideoMime(ftyp('heic'))).toBeNull()
    expect(sniffVideoMime(ftyp('mif1'))).toBeNull()
  })

  it('rejects images, empty and truncated input', () => {
    expect(sniffVideoMime(png())).toBeNull()
    expect(sniffVideoMime(Buffer.alloc(0))).toBeNull()
    expect(sniffVideoMime(Buffer.from([0x1a, 0x45]))).toBeNull()
  })

  it('maps video types to extensions', () => {
    expect(extensionFor('video/mp4')).toBe('mp4')
    expect(extensionFor('video/webm')).toBe('webm')
    expect(extensionFor('video/quicktime')).toBeUndefined()
  })
})

describe('sniffUploadMime', () => {
  it('honours the requested kind in both directions', () => {
    expect(sniffUploadMime(png(), 'image')).toBe('image/png')
    expect(sniffUploadMime(png(), 'video')).toBeNull()
    expect(sniffUploadMime(webm(), 'video')).toBe('video/webm')
    expect(sniffUploadMime(webm(), 'image')).toBeNull()
  })
})

describe('maxBytesFor', () => {
  it('gives video a larger ceiling than images', () => {
    expect(maxBytesFor('video')).toBeGreaterThan(maxBytesFor('image'))
    expect(maxBytesFor('image')).toBe(5 * 1024 * 1024)
  })
})
