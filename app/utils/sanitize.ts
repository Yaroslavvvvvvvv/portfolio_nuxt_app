import DOMPurify from 'isomorphic-dompurify'

// Central HTML sanitizer for any value rendered via `v-html`.
// Isomorphic: DOMPurify runs on jsdom during SSR and on the real DOM in the
// browser, so sanitized content is part of the server-rendered HTML (SEO).
//
// The allowlist covers exactly what the admin rich-text editor (Quill) can
// produce. Everything else is stripped, so payloads like `<img src=x onerror=…>`
// or `<iframe src=…>` are neutralised. `iframe` is deliberately absent: it would
// run third-party code on our own origin.
const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'span', 'div',
  'b', 'strong', 'i', 'em', 'u', 's', 'sub', 'sup',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
  'a', 'img',
]

// `class` carries Quill's alignment/indent classes (ql-align-center, ql-indent-1).
const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'loading', 'class']

let hookAdded = false

export function sanitizeHtml(dirty: unknown): string {
  if (!hookAdded) {
    DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
      if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer')
      }
      // Content images are below the fold far more often than not.
      if (node.tagName === 'IMG' && !node.hasAttribute('loading')) {
        node.setAttribute('loading', 'lazy')
      }
    })
    hookAdded = true
  }
  return DOMPurify.sanitize(String(dirty ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // No `data-*` attributes: nothing in our markup reads them.
    ALLOW_DATA_ATTR: false,
  })
}
