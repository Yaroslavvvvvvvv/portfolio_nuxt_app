import DOMPurify from 'dompurify'

// Central HTML sanitizer for any value rendered via `v-html`.
// Allows inline text-formatting, lists and anchors; strips every other attribute
// so payloads like `<img src=x onerror=...>` are neutralised. Client-only (needs DOM).
const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4']
const ALLOWED_ATTR = ['href', 'target', 'rel']

let hookAdded = false

export function sanitizeHtml(dirty: unknown): string {
  if (!import.meta.client) return ''
  if (!hookAdded) {
    DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
      if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer')
      }
    })
    hookAdded = true
  }
  return DOMPurify.sanitize(String(dirty ?? ''), { ALLOWED_TAGS, ALLOWED_ATTR })
}
