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
            <span v-if="i < nums.length - 1" class="op"> + </span>
          </template>

          <span class="op"> = </span>

          <div class="sum">{{ sum }}</div>
          <span class="label">{{ label }}</span>
        </div>

        <!-- 小尾巴 -->
        <i class="tail"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  issue: string | number
  nums: number[]
  sum: number
  label: string
  openedAt?: string
  avatar?: string
}
withDefaults(defineProps<Props>(), {
  avatar: '/assets/robot.png'
})
</script>

<style scoped>
.robot-card {
  display: flex;
  gap: 8px;
  padding: 8px 0;
  align-items: flex-start;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
  object-fit: cover;
  flex-shrink: 0;
}

.body { max-width: 80%; }

.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  margin: 0 2px 4px;
}
.nick { font-weight: 600; color: #374151; }
.dot { opacity: .7; }

.bubble {
  position: relative;
  background: #19a0ff; /* 蓝色主气泡 */
  color: #fff;
  border-radius: 16px;
  padding: 10px 12px;
  box-shadow: 0 2px 8px rgba(25,160,255,.25);
}

.title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  opacity: .98;
}

.row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.ball {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(255,255,255,.98);
  color: #1778bd;
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 13px;
}

.op { font-weight: 700; font-size: 15px; opacity: .95; }

.sum {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #ffeef0;
  color: #e11d48;
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 13px;
}

.label {
  margin-left: 4px;
  font-weight: 700;
  font-size: 12px;
}

.tail {
  position: absolute; left: -6px; top: 16px;
  width: 0; height: 0;
  border: 6px solid transparent;
  border-right-color: #19a0ff;
}
</style>
