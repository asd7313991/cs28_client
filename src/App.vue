<template>
  <div class="app-root">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
html, body, #app { height: 100%; }
body { margin: 0; overscroll-behavior-y: none; }
.app-root { min-height: 100dvh; background: var(--td-bg-color-page, #f7f8fa); }
</style>
