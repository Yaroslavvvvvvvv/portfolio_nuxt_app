<script setup lang="ts">
const { t } = useI18n()
const { data: faq } = await useFetch<any[]>('/api/content/faq')
</script>

<template>
  <div class="pub-faq">
    <h1>{{ t('public.faqTitle') }}</h1>
    <Accordion v-if="faq?.length" :value="['0']">
      <AccordionPanel v-for="(f, i) in faq" :key="f.id" :value="String(i)">
        <AccordionHeader>{{ f.question }}</AccordionHeader>
        <AccordionContent>
          <p>{{ f.answer }}</p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <p v-else class="is-muted">{{ t('common.empty') }}</p>
  </div>
</template>
