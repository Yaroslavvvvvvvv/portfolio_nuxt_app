import type { ResourceConfig } from './types'
import { blogResource } from './blog'
import { projectResource } from './projects'
import { serviceResource } from './services'
import { teamResource } from './team'
import { faqResource } from './faq'
import { pageResource } from './pages'
import { requestResource } from './requests'

// Registry of all admin resources. Add a resource here and it shows up in the
// sidebar and gets full CRUD screens automatically (no new routes/pages needed).
export const resources: ResourceConfig[] = [
  projectResource,
  serviceResource,
  teamResource,
  blogResource,
  faqResource,
  pageResource,
  requestResource,
]

export function getResource(name: string): ResourceConfig | undefined {
  return resources.find((r) => r.name === name)
}
