<template>
  <div class="grid">
    <button
      v-for="o in items"
      :key="o.play"
      class="cell"
      :class="{ dis: disabled, active: picked === o.play }"
      @click="picked = o.play"
      :disabled="disabled"
    >
      <div class="name">{{ o.name }}</div>
      <div class="odds">×{{ o.odds }}</div>
    </button>

    <div class="amount">
      <t-input v-model.number="amount" type="number" placeholder="输入金额" />
      <t-button size="small" theme="primary" :disabled="disabled || amount<=0 || !picked" :loading="placing" @click="submit">
        下注
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { useBetStore } from '@/features/bet/store'

interface TableItem { play: string; name: string; odds: number }
const props = defineProps<{ items: TableItem[] }>()

const bet = useBetStore()
const disabled = computed(() => bet.isLocked)
const placing = computed(() => bet.placing)

const picked = ref<string | null>(null)
const amount = ref<number>(0)

async function submit() {
  if (!picked.value) return Toast.warning({ content: '请选择玩法', duration: 1200 })
  if (amount.value <= 0) return Toast.warning({ content: '请输入金额', duration: 1200 })
  const res = await bet.place([{ play: picked.value, amount: amount.value }])
  if (res) amount.value = 0
}
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px }
.cell { padding: 10px; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.05) }
.cell.dis { opacity: .5 }
.cell.active { outline: 2px solid var(--td-brand-color, #0052d9) }
.amount { grid-column: 1 / -1; display: flex; gap: 8px; align-items: center }
.odds { font-size: 12px; color: #999 }
</style>
