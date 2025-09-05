<template>
  <div class="bill-card">
    <div class="header">
      <img class="bot" src="https://dummyimage.com/36x36/19a0ff/ffffff.png&text=R" alt="" />
      <div class="title">第 {{ issue }} 期玩家投注账单</div>
    </div>

    <div class="list">
      <div
        v-for="p in players"
        :key="p.id"
        class="row"
        @click="$emit('open-detail', p)"
      >
        <div class="name ellipsis">{{ p.name }}</div>
        <div class="right">
          <div class="amount">{{ masked ? mask(p.total) : (p.total + '元') }}</div>
          <t-icon name="chevron-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  issue: number | string
  players: Array<{ id: string; name: string; total: number }>
  masked?: boolean
}>()

const emit = defineEmits<{ (e: 'open-detail', p: any): void }>()

function mask(n: number | string) {
  return String(n).replace(/\d/g, '•')
}
</script>

<style scoped>
.bill-card {
  background: #fff; border-radius: 12px; padding: 10px; margin: 10px 0;
  box-shadow: 0 2px 12px rgba(0,0,0,.04);
}
.header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.bot { width:28px; height:28px; border-radius:50%; }
.title { font-weight: 700; }

.list { border-radius: 8px; overflow:hidden; background:#fafafa; }
.row {
  display:flex; align-items:center; justify-content:space-between;
  padding: 10px 12px; border-bottom:1px solid #f0f0f0;
}
.row:last-child { border-bottom: none; }
.name { max-width: 55%; }
.right { display:flex; align-items:center; gap:8px; color:#666; }
.amount { min-width: 76px; text-align: right; }
.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
