<template>
  <div class="app-wrapper">
    <div class="app-wrapper__top">
      <PublicHeader />
    </div>
    <div class="app-wrapper__content">
      <!-- Single place that bounds public page width, and the page's `main`
           landmark. Pages must not re-apply .app-container, nor nest a second
           `main` element; narrower shells (.pub-article) just nest inside. -->
      <main class="app-container">
        <slot />
      </main>
    </div>
    <div class="app-wrapper__bottom">
      <PublicFooter />
    </div>
  </div>
</template>
