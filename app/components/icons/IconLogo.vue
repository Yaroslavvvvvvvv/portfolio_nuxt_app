<script setup lang="ts">
// The Obsigma mark: a faceted diamond with a sigma cut into it.
//
// The artwork ships with hard-coded colours; here they are swapped for classes
// so a single component serves the navy-on-light, light-on-dark and
// white-over-video states without knowing which is which. Callers colour it
// through CSS: the body takes `currentColor`, the detail takes its counterpart.
//
// Stroke widths stay in user units so they scale with the mark. At the header's
// 40px the facet lines land on a quarter of a pixel and survive as anti-aliased
// hairlines, which is the intent. Below ~24px the whole thing turns to mush —
// a favicon needs a simplified cut of this artwork, not this one shrunk.
</script>

<template>
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <!-- Outer diamond -->
    <rect
      class="icon-logo__body"
      x="82"
      y="82"
      width="236"
      height="236"
      transform="rotate(45 200 200)"
      fill="currentColor"
    />

    <!-- Inner diamond outline -->
    <rect
      class="icon-logo__line"
      x="118"
      y="118"
      width="164"
      height="164"
      transform="rotate(45 200 200)"
      fill="none"
      stroke-width="2.5"
    />

    <!-- Axis lines from the inner diamond's corners out to the outer ones -->
    <g class="icon-logo__line" stroke-width="2.5">
      <line x1="200" y1="84" x2="200" y2="34" />
      <line x1="316" y1="200" x2="366" y2="200" />
      <line x1="200" y1="316" x2="200" y2="366" />
      <line x1="84" y1="200" x2="34" y2="200" />
    </g>

    <!-- Small diamond markers on each axis -->
    <g class="icon-logo__marker">
      <rect x="192" y="51" width="16" height="16" transform="rotate(45 200 59)" />
      <rect x="333" y="192" width="16" height="16" transform="rotate(45 341 200)" />
      <rect x="192" y="333" width="16" height="16" transform="rotate(45 200 341)" />
      <rect x="51" y="192" width="16" height="16" transform="rotate(45 59 200)" />
    </g>

    <!-- Sigma -->
    <path
      class="icon-logo__glyph"
      d="M 150 148 L 250 148 L 250 167 L 183 167 L 222 200 L 183 233 L 250 233 L 250 252 L 150 252 L 200 200 Z"
    />
  </svg>
</template>
