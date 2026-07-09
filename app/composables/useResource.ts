import type { ResourceConfig } from '~/config/resources/types'

interface ListResult {
  rows: any[]
  total: number
  page: number
  perPage: number
}

interface ListParams {
  page?: number
  perPage?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

// Thin CRUD client bound to a resource config. Every admin screen goes through here.
export function useResource(resource: ResourceConfig) {
  const base = `/api/admin/${resource.name}`
  return {
    list: (params: ListParams) => $fetch<ListResult>(base, { query: params }),
    get: (id: number | string) => $fetch<any>(`${base}/${id}`),
    create: (data: Record<string, any>) => $fetch(base, { method: 'POST', body: data }),
    update: (id: number | string, data: Record<string, any>) =>
      $fetch(`${base}/${id}`, { method: 'PUT', body: data }),
    remove: (id: number | string) => $fetch(`${base}/${id}`, { method: 'DELETE' }),
    toggleField: (id: number | string, field: string, value: any) =>
      $fetch(`${base}/${id}/field`, { method: 'PATCH', body: { field, value } }),
  }
}
