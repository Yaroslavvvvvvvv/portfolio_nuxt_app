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
// Same payload the header already fetched — shared via the composable's key.
const { data: settings } = await useSiteSettings()

// Uploaded from the admin's "Home page" screen. The banner falls back down this
// chain: video → still image with a slow zoom → the gradient in the stylesheet.
const heroVideo = computed(() => settings.value?.['home.heroVideo'] || '')
const heroVideoType = computed(() => (heroVideo.value.endsWith('.webm') ? 'video/webm' : 'video/mp4'))
const heroImage = computed(() => (heroVideo.value ? '' : settings.value?.['home.heroImage'] || ''))

const heroVideoEl = ref<HTMLVideoElement>()

onMounted(() => {
  // CSS already hides the video for these visitors; stop it from decoding frames
  // nobody will see — `autoplay` would otherwise keep it running off-screen.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideoEl.value?.pause()
  }
})

const topServices = computed(() => (services.value || []).slice(0, 3))
const topProjects = computed(() => (projects.value || []).slice(0, 3))
const topFaq = computed(() => (faq.value || []).slice(0, 4))
const topBlog = computed(() => (blog.value || []).slice(0, 3))
const principles = ['craft', 'speed', 'honesty', 'boldness']
</script>

<template>
  <div class="home">
    <!-- This wrapper is the page's single root: pageTransition animates exactly
         one element, and the home page has six top-level sections. -->
    <section class="home-hero">
      <!-- `muted` + `playsinline` are what make autoplay legal on mobile; drop
           either and the banner shows a frozen first frame. -->
      <video
        v-if="heroVideo"
        ref="heroVideoEl"
        :key="heroVideo"
        class="home-hero__video"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
        tabindex="-1"
      >
        <source :src="heroVideo" :type="heroVideoType">
      </video>

      <!-- The banner image is the page's LCP element: it must not be lazy, and
           it asks the browser for priority ahead of the fonts and the icons. -->
      <img
        v-else-if="heroImage"
        :src="heroImage"
        class="home-hero__image"
        alt=""
        aria-hidden="true"
        fetchpriority="high"
      >

      <div class="home-hero__scrim" />

      <!-- The banner shows no copy, but the page still needs one h1 naming its
           subject — for crawlers and for anyone navigating by headings. -->
      <h1 class="visually-hidden">{{ t('home.heroTitle') }}</h1>
    </section>

    <section class="pub-section">
      <div class="pub-section__head"><h2>{{ t('home.philosophyTitle') }}</h2></div>
      <div class="home-principles">
        <div v-for="(p, i) in principles" :key="p" class="home-principle">
          <div class="home-principle__num">0{{ i + 1 }}</div>
          <div class="home-principle__title">{{ t(`home.principles.${p}Title`) }}</div>
          <div class="home-principle__text">{{ t(`home.principles.${p}Text`) }}</div>
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
      <div class="home-cta">
        <h2 class="home-cta__title">{{ t('home.ctaTitle') }}</h2>
        <p class="home-cta__text">{{ t('home.ctaText') }}</p>
        <div class="home-cta__actions">
          <NuxtLink to="/contacts" class="home-cta__btn"><i class="pi pi-send" /> {{ t('action.contact') }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
