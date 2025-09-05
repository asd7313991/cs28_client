<template>
  <div class="marquee">
    <div class="marquee-track" :style="{ animationDuration: duration + 's' }">
      <span class="marquee-item">{{ text }}</span>
      <span class="marquee-item">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; duration?: number }>(), {
  duration: 20, // 越大越慢
})
</script>

<style scoped>
.marquee { overflow: hidden; }
.marquee-track {
  display: inline-flex;
  gap: 2rem;
  white-space: nowrap;
  will-change: transform;
  animation: nb-marquee linear infinite;
}
@keyframes nb-marquee {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
</style>
