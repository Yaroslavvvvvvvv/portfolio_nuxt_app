<template>
  <div class="app-wrapper">
    <div class="app-wrapper__top">
      <PublicHeader />
    </div>
    <div class="app-wrapper__content">
      <!-- Single place that bounds public page width. Pages must not re-apply
           .app-container; narrower shells (.pub-article) just nest inside. -->
      <div class="app-container">
        <slot />
      </div>
    </div>
    <div class="app-wrapper__bottom">
      <PublicFooter />
    </div>
  </div>
</template>
