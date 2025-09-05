<template>
  <div class="res">
    <span class="ball">{{ a }}</span>
    <span class="plus">+</span>
    <span class="ball">{{ b }}</span>
    <span class="plus">+</span>
    <span class="ball gray">{{ c }}</span>
    <span class="eq">=</span>
    <span class="sum">{{ sum }}</span>
    <span class="label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ a:number; b:number; c:number; sum:number; label:string }>()
</script>

<style scoped>
.res { display:flex; align-items:center; gap:6px; }
.ball {
  display:inline-flex; align-items:center; justify-content:center;
  width:22px; height:22px; border-radius:50%;
  background:#19A0FF; color:#fff; font-weight:700; font-size:12px;
}
.ball.gray { background:#9CA3AF; }
.plus, .eq { opacity:.7; }
.sum { font-weight: 800; margin-left: 2px; }
.label { margin-left: 4px; font-weight:700; }
</style>
