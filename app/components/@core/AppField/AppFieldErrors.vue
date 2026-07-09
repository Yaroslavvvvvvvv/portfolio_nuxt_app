<script setup lang="ts">
// Ported from Complat @core/AppFieldErrors — Message-based error list.
const props = defineProps<{ errors?: string | string[] }>()

const list = computed(() => {
  if (!props.errors) return []
  return Array.isArray(props.errors) ? props.errors.filter(Boolean) : [props.errors]
})
</script>

<template>
  <div v-if="list.length" class="app-field-errors">
    <Message v-for="(e, i) in list" :key="i" severity="error" size="small" variant="simple">
      {{ e }}
    </Message>
  </div>
</template>
