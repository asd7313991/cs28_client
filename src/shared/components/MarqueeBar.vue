<!-- src/shared/components/MarqueeBar.vue -->
<template>
  <div class="marquee-wrap" :class="{ 'has-label': !!label }">
    <span v-if="label" class="marquee-label">{{ label }}</span>

    <div
      class="marquee"
      :style="{ '--marquee-duration': duration + 's' }"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      role="marquee"
      aria-live="polite"
    >
      <div class="marquee-track" :class="{ paused }">
        <span class="marquee-item">{{ text }}</span>
        <span class="marquee-item">{{ text }}</span>
      </div>
      <!-- 渐隐遮罩，可选 -->
      <div class="fade fade-left" />
      <div class="fade fade-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  text: string
  duration?: number
  label?: string
}>()

const paused = ref(false)
const duration = props.duration ?? 14
const label = props.label ?? ''
const text = props.text || ''
</script>

<style scoped>
.marquee-wrap{
  display:flex; align-items:center; gap:8px; position:relative;
}
.marquee-wrap.has-label .marquee-label{
  color:#6b7280; font-size:14px; white-space:nowrap; flex:0 0 auto;
}

.marquee{
  position:relative; overflow:hidden; flex:1 1 auto; min-height:24px;
}
.marquee-track{
  display:inline-flex; gap:2rem; white-space:nowrap;
  will-change:transform;
  animation: nb-marquee var(--marquee-duration, 14s) linear infinite;
}
.marquee-track.paused{ animation-play-state: paused; }
.marquee-item{ white-space:nowrap; }

/* 渐隐边缘，可按需移除 */
.fade{
  position:absolute; top:0; bottom:0; width:24px; pointer-events:none;
  background: linear-gradient(to right, var(--td-bg-color-page), transparent);
}
.fade-right{ right:0; transform: scaleX(-1); }
.fade-left{ left:0; }

/* 无缝滚动关键帧：两段文本拼接 */
@keyframes nb-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
