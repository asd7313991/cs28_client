<template>
  <div class="quickbet">
    <t-textarea
      v-model="text"
      placeholder="示例：大300丨小300（最多10条，用“丨”分隔）"
      :maxlength="120"
      :autosize="{ minRows: 2, maxRows: 4 }"
    />
    <div class="row">
      <t-button theme="default" variant="outline" size="small" @click="onClear">清空</t-button>
      <t-button theme="primary" size="small" :disabled="disabled" :loading="placing" @click="onSubmit">快投</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { useBetStore } from '@/features/bet/store'
import { parseQuickBet } from '@/shared/utils/quickbet'

const emit = defineEmits<{ (e: 'done'): void }>()

const text = ref('')
const bet = useBetStore()

const placing = computed(() => bet.placing)
const disabled = computed(() => bet.isLocked || !text.value.trim())

function onClear() { text.value = '' }

async function onSubmit() {
  try {
    // 先做本地解析校验（报“投注种类过多”等）
    parseQuickBet(text.value)
    const res = await bet.placeQuick(text.value)
    if (res) {
      text.value = ''
      emit('done')
    }
  } catch (e: any) {
    Toast.warning({ content: String(e?.message || e), duration: 1500 })
  }
}
</script>

<style scoped>
.quickbet { padding: 8px; background: #fff; border-radius: 12px }
.row { margin-top: 8px; display: flex; gap: 8px; align-items: center }
</style>
