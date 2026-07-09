<script setup lang="ts">
import type { ResourceConfig } from '~/config/resources/types'

const props = defineProps<{ resource: ResourceConfig }>()
const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const api = useResource(props.resource)

const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const perPage = ref(10)
const sortField = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const search = ref('')
const first = computed(() => (page.value - 1) * perPage.value)

function errMsg(e: any) {
  return e?.data?.statusMessage || e?.statusMessage || e?.message || ''
}

async function load() {
  loading.value = true
  try {
    const res = await api.list({
      page: page.value,
      perPage: perPage.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
      search: search.value,
    })
    rows.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

onMounted(load)

function onPage(e: any) {
  page.value = e.page + 1
  perPage.value = e.rows
  load()
}

function onSort(e: any) {
  if (!e.sortField) return
  sortField.value = e.sortField
  sortOrder.value = e.sortOrder === 1 ? 'asc' : 'desc'
  load()
}

let searchTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 300)
}

async function toggle(row: any, field: string, value: boolean) {
  try {
    await api.toggleField(row.id, field, value)
    row[field] = value
    toast.add({ severity: 'success', summary: t('toast.updated'), life: 1800 })
  } catch (e) {
    toast.add({ severity: 'error', summary: t('toast.error'), detail: errMsg(e), life: 4000 })
  }
}

function remove(row: any) {
  confirm.require({
    header: t('confirm.deleteTitle'),
    message: t('confirm.deleteText'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('confirm.accept'),
    rejectLabel: t('confirm.reject'),
    acceptProps: { severity: 'danger' },
    rejectProps: { severity: 'secondary', text: true },
    accept: async () => {
      try {
        await api.remove(row.id)
        toast.add({ severity: 'success', summary: t('toast.deleted'), life: 2200 })
        load()
      } catch (e) {
        toast.add({ severity: 'error', summary: t('toast.error'), detail: errMsg(e), life: 4000 })
      }
    },
  })
}

function fmt(v: any) {
  if (Array.isArray(v)) return v.join(', ')
  return typeof v === 'string' && v.length > 60 ? v.slice(0, 60) + '…' : v
}
</script>

<template>
  <DataTable
    :value="rows"
    :lazy="true"
    :paginator="true"
    :rows="perPage"
    :rows-per-page-options="[10, 20, 50]"
    :total-records="total"
    :first="first"
    :loading="loading"
    data-key="id"
    sort-mode="single"
    @page="onPage"
    @sort="onSort"
  >
    <template #header>
      <div class="resource-table__header">
        <h2>{{ t(resource.labelPlural) }}</h2>
        <div class="resource-table__actions">
          <InputText v-model="search" :placeholder="t('action.search')" @input="onSearch" />
          <NuxtLink v-if="resource.creatable !== false" :to="`/admin/${resource.name}/create`">
            <Button :label="t('action.add')" icon="pi pi-plus" size="small" />
          </NuxtLink>
        </div>
      </div>
    </template>

    <Column
      v-for="col in resource.columns"
      :key="col.field"
      :field="col.field"
      :header="t(col.label)"
      :sortable="col.sortable"
    >
      <template #body="{ data }">
        <ToggleSwitch
          v-if="col.type === 'boolean'"
          :model-value="data[col.field]"
          @update:model-value="(v: boolean) => toggle(data, col.field, v)"
        />
        <span v-else-if="col.type === 'date'">{{ formatDate(data[col.field], 'DD.MM.YYYY HH:mm') }}</span>
        <span v-else>{{ fmt(data[col.field]) }}</span>
      </template>
    </Column>

    <Column :header="t('table.actions')" :style="{ width: '7rem' }">
      <template #body="{ data }">
        <div class="resource-table__row-actions">
          <NuxtLink :to="`/admin/${resource.name}/${data.id}`">
            <Button icon="pi pi-pencil" size="small" text />
          </NuxtLink>
          <Button icon="pi pi-trash" size="small" text severity="danger" @click="remove(data)" />
        </div>
      </template>
    </Column>

    <template #empty>{{ t('common.empty') }}</template>
  </DataTable>
</template>
