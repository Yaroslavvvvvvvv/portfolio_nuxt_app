<script setup lang="ts">
const { t } = useI18n()
const site = useSiteConfig()

usePageSeo(() => ({ title: t('home.metaTitle'), description: t('meta.home') }))

useJsonLd(() => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  description: t('meta.home'),
}))
const { data: services } = await useFetch<any[]>('/api/content/services')
const { data: projects } = await useFetch<any[]>('/api/content/projects')
const { data: faq } = await useFetch<any[]>('/api/content/faq')
const { data: blog } = await useFetch<any[]>('/api/content/blog')

const topServices = computed(() => (services.value || []).slice(0, 3))
const topProjects = computed(() => (projects.value || []).slice(0, 3))
const topFaq = computed(() => (faq.value || []).slice(0, 4))
const topBlog = computed(() => (blog.value || []).slice(0, 3))
const principles = ['craft', 'speed', 'honesty', 'boldness']
</script>

<template>
  <div>
    <section class="pub-hero">
      <h1 class="pub-hero__title">{{ t('home.heroTitle') }}</h1>
      <p class="pub-hero__text">{{ t('home.heroText') }}</p>
    </section>

    <section class="pub-section">
      <div class="pub-section__head"><h2>{{ t('home.philosophyTitle') }}</h2></div>
      <div class="pub-principles">
        <div v-for="(p, i) in principles" :key="p" class="pub-principle">
          <div class="pub-principle__num">0{{ i + 1 }}</div>
          <div class="pub-principle__title">{{ t(`home.principles.${p}Title`) }}</div>
          <div class="pub-principle__text">{{ t(`home.principles.${p}Text`) }}</div>
        </div>
      </div>
    </section>

    <section class="pub-section">
      <div class="pub-section__head">
        <h2>{{ t('home.servicesTitle') }}</h2>
        <NuxtLink to="/services" class="field-link">{{ t('action.allServices') }} →</NuxtLink>
      </div>
      <div class="pub-services">
        <div v-for="s in topServices" :key="s.id" class="pub-service">
          <div class="pub-service__icon"><i :class="s.icon || 'pi pi-star'" /></div>
          <h3 class="pub-service__title">{{ s.title }}</h3>
          <p class="pub-service__text">{{ s.description }}</p>
        </div>
      </div>
    </section>

    <section class="pub-section">
      <div class="pub-section__head">
        <h2>{{ t('home.worksTitle') }}</h2>
        <NuxtLink to="/projects" class="field-link">{{ t('action.allProjects') }} →</NuxtLink>
      </div>
      <div class="pub-grid">
        <NuxtLink v-for="p in topProjects" :key="p.id" :to="`/projects/${p.slug}`" class="pub-card">
          <div class="pub-card__media" :style="p.imagePath ? { backgroundImage: `url(${p.imagePath})` } : {}" />
          <div class="pub-card__body">
            <span class="pub-card__title">{{ p.title }}</span>
            <div class="pub-project__meta"><span>{{ p.client }}</span><span>{{ p.year }}</span></div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="pub-section">
      <div class="pub-section__head">
        <h2>{{ t('home.faqTitle') }}</h2>
        <NuxtLink to="/faq" class="field-link">FAQ →</NuxtLink>
      </div>
      <Accordion v-if="topFaq.length" :value="['0']">
        <AccordionPanel v-for="(f, i) in topFaq" :key="f.id" :value="String(i)">
          <AccordionHeader>{{ f.question }}</AccordionHeader>
          <AccordionContent><p>{{ f.answer }}</p></AccordionContent>
        </AccordionPanel>
      </Accordion>
    </section>

    <section class="pub-section">
      <div class="pub-section__head">
        <h2>{{ t('home.blogTitle') }}</h2>
        <NuxtLink to="/blog" class="field-link">{{ t('action.allPosts') }} →</NuxtLink>
      </div>
      <div class="pub-grid">
        <NuxtLink v-for="b in topBlog" :key="b.id" :to="`/blog/${b.slug}`" class="pub-card">
          <div class="pub-card__media" :style="b.imagePath ? { backgroundImage: `url(${b.imagePath})` } : {}" />
          <div class="pub-card__body">
            <span class="pub-card__title">{{ b.title }}</span>
            <span class="pub-card__desc">{{ b.shortDescription }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section>
      <div class="pub-cta">
        <h2 class="pub-cta__title">{{ t('home.ctaTitle') }}</h2>
        <p class="pub-cta__text">{{ t('home.ctaText') }}</p>
        <div class="pub-cta__actions">
          <NuxtLink to="/contacts" class="pub-cta__btn"><i class="pi pi-send" /> {{ t('action.contact') }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
