import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../app/utils/sanitize'

// The sanitizer is the only thing standing between admin-authored HTML and the
// public page. It runs on the server too (jsdom), so these assertions cover SSR.
describe('sanitizeHtml', () => {
  it('keeps the markup the rich-text editor produces', () => {
    const html = sanitizeHtml(
      '<h2>Title</h2><p><strong>bold</strong> <em>italic</em></p>'
      + '<ul><li>one</li></ul><blockquote>quote</blockquote><pre>code</pre>',
    )
    expect(html).toContain('<h2>Title</h2>')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<blockquote>quote</blockquote>')
    expect(html).toContain('<pre>code</pre>')
  })

  it('keeps images and marks them lazy', () => {
    const html = sanitizeHtml('<img src="/uploads/2026/07/a.png" alt="pic">')
    expect(html).toContain('src="/uploads/2026/07/a.png"')
    expect(html).toContain('alt="pic"')
    expect(html).toContain('loading="lazy"')
  })

  it("keeps Quill's alignment classes", () => {
    expect(sanitizeHtml('<p class="ql-align-center">x</p>')).toContain('class="ql-align-center"')
  })

  it('strips script tags and inline event handlers', () => {
    const html = sanitizeHtml('<p>ok</p><script>alert(1)</script><img src=x onerror=alert(1)>')
    expect(html).toContain('<p>ok</p>')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('alert(1)')
  })

  it('strips iframes — third-party code must not run on our origin', () => {
    expect(sanitizeHtml('<iframe src="https://evil.test"></iframe>')).not.toContain('iframe')
  })

  it('strips javascript: URLs', () => {
    const html = sanitizeHtml('<a href="javascript:alert(1)">x</a>')
    expect(html).not.toContain('javascript:')
  })

  it('hardens target=_blank links against reverse tabnabbing', () => {
    const html = sanitizeHtml('<a href="https://example.com" target="_blank">x</a>')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('drops data-* attributes', () => {
    expect(sanitizeHtml('<p data-evil="1">x</p>')).not.toContain('data-evil')
  })

  it('handles null and undefined without throwing', () => {
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
  })
})
