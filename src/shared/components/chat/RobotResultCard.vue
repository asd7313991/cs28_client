<template>
  <div class="robot-card">
    <!-- 左侧头像 -->
    <img class="avatar" :src="avatar" alt="机器人" />

    <!-- 主体 -->
    <div class="body">
      <div class="meta">
        <span class="nick">CS28机器人</span>
        <span v-if="openedAt" class="dot">·</span>
        <span v-if="openedAt" class="time">{{ openedAt }}</span>
      </div>

      <!-- 蓝色气泡 -->
      <div class="bubble">
        <div class="title">第{{ issue }}期开奖结果</div>

        <div class="row">
          <template v-for="(n, i) in nums" :key="i">
            <div class="ball">{{ n }}</div>
            <span v-if="i < nums.length - 1" class="op">+</span>
          </template>

          <span class="op eq">=</span>

          <div class="sum">{{ sum }}</div>
          <span class="tag">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
  issue: string | number
  nums: (string | number)[]
  sum: string | number
  label: string
  openedAt?: string
}>()
</script>

<style scoped>
:root {
  --c-blue: #2b7cff;
  --c-shadow: 0 6px 16px rgba(43,124,255,.18);
}
.robot-card{
  display:flex; align-items:flex-start; gap:12px; padding:8px 0; width:100%;
}
.avatar{
  width:34px; height:34px; border-radius:50%; flex:0 0 34px; object-fit:cover;
  box-shadow: 0 2px 6px rgba(0,0,0,.08);
}
.body{ flex:1; min-width:0; }
.meta{ display:flex; align-items:center; gap:6px; margin-bottom:6px; font-size:12px; color:#8a94a6; }
.nick{ color:#2b2f36; font-weight:600; }
.dot{ opacity:.6; }
.time{ letter-spacing:.2px; }

.bubble{
  width:fit-content; max-width:calc(100% - 40px);
  background: linear-gradient(180deg, #3a8cff 0%, #2b7cff 100%);
  color:#fff; padding:12px 14px; border-radius:16px; box-shadow: var(--c-shadow);
}
.title{ font-size:12px; opacity:.9; margin-bottom:8px; }
.row{ display:flex; align-items:center; flex-wrap:wrap; gap:8px; row-gap:10px; }

.ball{
  width:28px; height:28px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:#fff; color:#1f65d9; font-weight:700;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.06);
}
.op{ font-weight:700; font-size:16px; line-height:1; margin:0 2px; opacity:.95; }
.op.eq{ margin-left:6px; margin-right:2px; }
.sum{
  min-width:32px; height:28px; padding:0 10px; border-radius:14px; background:#fff; color:#1f65d9;
  display:flex; align-items:center; justify-content:center; font-weight:800; letter-spacing:.5px;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.06);
}
.tag{
  margin-left:6px; height:24px; padding:0 10px; border-radius:999px;
  background: rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.35);
  display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; backdrop-filter: blur(2px);
}
</style>
