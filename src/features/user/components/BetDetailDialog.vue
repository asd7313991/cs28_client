<template>
  <t-dialog v-model:visible="innerVisible" :footer="false" width="86vw">
    <template #header>
      <div class="dlg-header">
        <div class="name">{{ player?.name }} 下注详情</div>
        <div class="sum" v-if="player">共 {{ masked ? mask(player.total) : (player.total + '元') }}</div>
      </div>
    </template>

    <div class="list" v-if="player">
      <div class="item" v-for="(it, idx) in player.items" :key="idx">
        <div class="label">{{ it.label }}</div>
        <div class="price">{{ masked ? mask(it.amount) : it.amount }}</div>
      </div>
    </div>

    <div class="btns">
      <t-button block theme="primary" @click="innerVisible=false">我知道了</t-button>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: boolean
  player: { name: string; total: number; items: Array<{label: string; amount: number}> } | null
  masked?: boolean
}>()
const emit = defineEmits<{(e:'update:modelValue', v:boolean):void}>()
const innerVisible = computed({
  get:()=>props.modelValue,
  set:(v)=>emit('update:modelValue', v)
})
function mask(n: number | string) {
  return String(n).replace(/\d/g, '•')
}
</script>

<style scoped>
.dlg-header { text-align:center; }
.name { font-weight: 700; }
.sum { margin-top: 4px; color:#666; }
.list { margin: 8px 0 12px; }
.item {
  display:flex; justify-content:space-between; align-items:center;
  padding: 10px 12px; background:#f7f7f7; border-radius:10px; margin-bottom:8px;
}
.label { font-weight: 600; }
.price { color:#e11d48; font-weight:700; }
.btns { margin-top: 8px; }
</style>
