<template>
  <div class="table-bet">
    <!-- 玩法格子 -->
    <div class="grid">
      <button
        v-for="o in items"
        :key="o.play"
        class="cell"
        :class="{ dis: disabled, active: picked[o.play] > 0 }"
        :disabled="disabled"
        @click="addBet(o)"
      >
        <div class="name">{{ o.name }}</div>
        <div class="odds">×{{ o.odds }}</div>
        <div v-if="picked[o.play]" class="amt">{{ picked[o.play] }}</div>
      </button>
    </div>

    <!-- 筹码条 -->
    <div class="chips">
      <t-button
        v-for="c in chips"
        :key="c"
        size="small"
        variant="outline"
        :theme="c === currentChip ? 'primary' : 'default'"
        @click="currentChip = c"
      >
        ¥{{ c }}
      </t-button>
    </div>

    <!-- 操作栏 -->
    <div class="actions">
      <div class="summary">
        已投 {{ betCount }} 注，共 {{ betAmount }} 元
      </div>
      <div class="buttons">
        <t-button size="small" variant="outline" @click="clear">清空</t-button>
        <t-button size="small" theme="primary" :disabled="disabled || betCount === 0" :loading="placing" @click="submit">
          确认投注
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { useBetStore } from '@/features/bet/store'

interface TableItem { play: string; name: string; odds: number }
const props = defineProps<{ items: TableItem[] }>()

const bet = useBetStore()
const disabled = computed(() => bet.isLocked)
const placing = computed(() => bet.placing)

// 当前选中筹码
const chips = [1, 5, 10, 100, 500]
const currentChip = ref(5)

// 投注池：{ [play]: amount }
const picked = reactive<Record<string, number>>({})

function addBet(o: TableItem) {
  if (disabled.value) return
  picked[o.play] = (picked[o.play] || 0) + currentChip.value
}

function clear() {
  for (const k in picked) delete picked[k]
}

const betCount = computed(() => Object.keys(picked).length)
const betAmount = computed(() => Object.values(picked).reduce((a, b) => a + b, 0))

async function submit() {
  const items = Object.entries(picked).map(([play, amt]) => ({ play, amount: amt }))
  if (!items.length) return Toast.warning({ content: '请先选择投注', duration: 1200 })

  const res = await bet.place(items)
  if (res) clear()
}
</script>

<style scoped>
.table-bet { background: #fff; border-radius: 12px; padding: 12px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.cell { padding: 10px; border-radius: 8px; background: #f8f8f8; text-align: center; position: relative; }
.cell.active { border: 2px solid var(--td-brand-color, #0052d9); }
.cell.dis { opacity: .5 }
.odds { font-size: 12px; color: #999; }
.amt { position: absolute; bottom: 4px; right: 6px; font-size: 12px; color: #e74c3c; }
.chips { display: flex; gap: 6px; margin-top: 10px; }
.actions { margin-top: 10px; display: flex; align-items: center; justify-content: space-between; }
.summary { font-size: 13px; color: #666; }
.buttons { display: flex; gap: 6px; }
</style>
