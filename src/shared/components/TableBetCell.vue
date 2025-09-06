<template>
  <!-- ✅ 指定 type，避免在 form 场景被浏览器接管 -->
  <button type="button" :class="btnClass" :disabled="disabled" @click="$emit('tap')">
    <div class="title">{{ name }}</div>
    <div class="odds">×{{ odds }}</div>
    <div v-if="(amount || 0) > 0" class="badge">¥{{ amount }}</div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  odds: number
  amount?: number
  disabled?: boolean   // 外部显式传；默认 false
  big?: boolean
}>()

defineEmits<{ (e: 'tap'): void }>()

const btnClass = computed(() => ({
  cell: true,
  big: !!props.big,
  dis: !!props.disabled,
  active: (props.amount || 0) > 0,
}))
</script>

<style scoped>
/* 保持你现在的样式 */
.cell { position: relative; height: 68px; border-radius: 12px; background: #fff;
  border: 1px solid #e8edf6; box-shadow: 0 2px 10px rgba(17,24,39,.04);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  transition: all .15s ease;
}
.cell.big { height: 80px; }
.cell .title { font-size: 16px; font-weight: 700; color:#111827; line-height:1; }
.cell .odds { margin-top: 6px; font-size: 12px; color:#97a3b7; }
.cell.active { outline: 2px solid #4da3ff; box-shadow: 0 6px 18px rgba(24,144,255,.16); }
.cell.dis { opacity:.55; pointer-events: none; }  /* disabled 时不可点 */
.badge { position:absolute; right:8px; bottom:8px; font-size:11px; padding:2px 6px; border-radius:10px;
  color:#1f2937; background:#e9f2ff; border:1px solid #d2e6ff; }
</style>
