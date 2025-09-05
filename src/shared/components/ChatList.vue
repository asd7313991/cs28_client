<template>
  <div
    class="chat-list"
    ref="wrap"
    @scroll.passive="onScroll"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="inner" :style="innerStyle">
      <!-- 顶部指示区 -->
      <div class="top-indicator">
        <template v-if="loadingMore">
          <span class="spinner"></span> 加载中…
        </template>
        <template v-else-if="pulling">
          <span>{{ pullDist < PULL_THRESHOLD ? '下拉查看更多' : '松开加载更多' }}</span>
        </template>
        <template v-else>
          <span v-if="hasMore">下拉查看更多</span>
          <span v-else>已无更多</span>
        </template>
      </div>

      <!-- 消息列表 -->
      <template v-for="(m, idx) in messages" :key="m.id">
        <!-- 时间分割线：首条 / 间隔>5min / 跨日 -->
        <div v-if="needTimeSep(idx)" class="time-sep">
          {{ formatSep(messages[idx].ts) }}
        </div>

        <!-- 🟦 机器人开奖结果（使用组件自带头像，避免双头像） -->
        <RobotResultCard
          v-if="isRobotDraw(m as any)"
          :avatar="robotAvatarUrl"
          v-bind="normalizePayload(m as any)"
          class="robot-bubble"
        />

        <!-- 其它消息走普通气泡（原样保留） -->
        <div v-else class="row" :class="{ self: isSelf(m as any) }">
          <!-- 头像（自己消息不显示头像） -->
          <div v-if="!isSelf(m as any)" class="avatar-wrap">
            <img v-if="(m as any).avatar" :src="(m as any).avatar" class="avatar" />
            <div v-else class="avatar fallback">{{ (m as any).nick?.[0] || '友' }}</div>
            <div v-if="(m as any).vip" class="vip-badge">VIP {{ (m as any).vip }}</div>
          </div>

          <!-- 内容块：昵称+时间（在气泡上方） + 气泡 -->
          <div class="msg-col" :class="{ right: isSelf(m as any) }">
            <div class="meta" :class="{ right: isSelf(m as any) }">
              <span class="nick">{{ (m as any).nick }}</span>
              <span v-if="(m as any).vip" class="vip-chip">VIP {{ (m as any).vip }}</span>
              <span class="ts">{{ fullTime((m as any).ts) }}</span>
            </div>

            <div class="bubble" :class="bubbleClass(m as any)">
              <div class="content">{{ (m as any).content }}</div>
              <i class="tail" />
            </div>
          </div>
        </div>
      </template>

      <div class="bottom-spacer" />
    </div>

    <!-- 悬浮回底部（可拖拽） -->
    <t-badge
      v-if="showBottomBtn"
      :count="unread"
      :max-count="99"
      :offset="[-6, -6]"
    >
      <t-fab
        v-model:visible="showBottomBtn"
        :icon="downIcon"
        draggable="all"
        :style="{ right: '12px', bottom: '144px' }"  
        @click="scrollToBottom"
      />
    </t-badge>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import RobotResultCard from '@/shared/components/chat/RobotResultCard.vue'
import { h } from 'vue'
import { ArrowDownIcon } from 'tdesign-icons-vue-next'

const downIcon = () => h(ArrowDownIcon, { size: '20px' })


/** GM 开奖播报 payload（规范化后传给卡片） */
type RobotCardProps = {
  issue: string | number
  nums: (string | number)[]
  sum: string | number
  label: string
  openedAt?: string
}

/** 基础消息 */
type BaseMsg = {
  id: string
  nick: string
  ts: number
  avatar?: string
  vip?: number
  self?: boolean
}
type UserLikeMsg = BaseMsg & {
  type?: 'user' | 'bot' | 'system'
  content: string
}
export type RobotDrawMsg = BaseMsg & {
  type: 'robot_draw'
  payload: {
    issue: string | number
    nums: number[]
    sum: number
    label: string
    openedAt?: string
  }
}
type Msg = UserLikeMsg | RobotDrawMsg

const props = defineProps<{
  messages: Msg[]
  hasMore: boolean
  selfNick?: string
  /** 可选：机器人头像地址（不传用默认） */
  robotAvatar?: string
}>()
const emit = defineEmits<{ (e: 'loadMore'): void }>()

const wrap = ref<HTMLElement | null>(null)
const atBottom = ref(true)
const loadingMore = ref(false)
let prevHeight = 0

// 未读 & 回底部
const showBottomBtn = ref(false)
const unread = ref(0)

// —— 下拉（不足一屏也能触发） —— //
const PULL_THRESHOLD = 60
const PULL_MAX = 120
const pulling = ref(false)
const pullDist = ref(0)
let startY = 0

function onTouchStart(e: TouchEvent) {
  if (!wrap.value) return
  if (wrap.value.scrollTop <= 0) {
    pulling.value = true
    pullDist.value = 0
    startY = e.touches[0].clientY
  } else {
    pulling.value = false
  }
}
function onTouchMove(e: TouchEvent) {
  if (!pulling.value || !wrap.value) return
  const dy = e.touches[0].clientY - startY
  if (dy <= 0) { pullDist.value = 0; return }
  e.preventDefault()
  pullDist.value = Math.min(dy, PULL_MAX)
}
function onTouchEnd() {
  if (!pulling.value) return
  if (pullDist.value >= PULL_THRESHOLD && props.hasMore && !loadingMore.value) {
    triggerLoadMore(true)
  }
  pulling.value = false
  pullDist.value = 0
}
const innerStyle = computed(() => {
  const y = (pulling.value || loadingMore.value) ? pullDist.value : 0
  return `transform: translateY(${y}px); transition: ${pulling.value ? 'none' : 'transform .2s ease'};`
})

function isSelf(m: any) {
  return m?.self || (!!props.selfNick && m?.nick === props.selfNick)
}
function bubbleClass(m: any) {
  return { bot: m?.type === 'bot', self: isSelf(m) }
}

function onScroll() {
  if (!wrap.value) return
  const el = wrap.value
  atBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
  showBottomBtn.value = !atBottom.value
  
}
function triggerLoadMore(fromPull: boolean) {
  if (!wrap.value) return
  loadingMore.value = true
  prevHeight = wrap.value.scrollHeight
  if (fromPull) pullDist.value = PULL_THRESHOLD
  emit('loadMore')
}
watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    const el = wrap.value
    if (!el) return
    if (loadingMore.value) {
      const diff = el.scrollHeight - prevHeight
      el.scrollTop = diff
      loadingMore.value = false
      pullDist.value = 0
      return
    }
    const last = props.messages[props.messages.length - 1] as any
    if (atBottom.value || last?.self) {
      el.scrollTop = el.scrollHeight
      unread.value = 0
      showBottomBtn.value = false
    } else {
      unread.value = Math.min(999, unread.value + 1)
      showBottomBtn.value = true
    }
  },
  { flush: 'post' }
)

function scrollToBottom() {
  if (!wrap.value) return
  wrap.value.scrollTop = wrap.value.scrollHeight
  unread.value = 0
  showBottomBtn.value = false
}

function fmt(ts: number) {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}
function fullTime(ts: number) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day} ${fmt(ts)}`
}

// 时间分割线策略
function needTimeSep(idx: number) {
  if (idx === 0) return true
  const prev = (props.messages[idx - 1] as any)?.ts
  const cur = (props.messages[idx] as any)?.ts
  if (!prev || !cur) return false
  const gap = Math.abs(cur - prev)
  if (gap > 5 * 60 * 1000) return true
  const d1 = new Date(prev).toDateString()
  const d2 = new Date(cur).toDateString()
  return d1 !== d2
}
function formatSep(ts: number) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

/* ---------------- 机器人开奖识别 + 解析 ---------------- */
const DRAW_RE_1 =
  /第\s*(\d{6,10})\s*期(?:[^0-9]|$).*?(\d)\s*[+\+＋]\s*(\d)\s*[+\+＋]\s*(\d)\s*[=＝]\s*(\d{1,2})(?:\s*([大小]))?(?:\s*(单|双))?/i
const DRAW_RE_2 =
  /第\s*(\d{6,10})\s*期.*?(?:开|结|果).*?(\d)\s*[+\+＋]\s*(\d)\s*[+\+＋]\s*(\d)\s*[=＝]\s*(\d{1,2})(?:\s*([大小]))?(?:\s*(单|双))?/i

function buildLabel(sum: number, size?: string, oddEven?: string): string {
  if (sum <= 5) return oddEven ? `极小${oddEven}` : '极小'
  if (sum >= 22) return oddEven ? `极大${oddEven}` : '极大'
  const sz = size || (sum >= 14 ? '大' : '小')
  const oe = oddEven || (sum % 2 === 0 ? '双' : '单')
  return `${sz}${oe}`
}

/** 是否为机器人开奖结果消息（结构化或文本匹配） */
function isRobotDraw(m: any): boolean {
  if (!m) return false
  if (m.type === 'robot_draw' && m.payload) return true
  const maybeBot = m.type === 'bot' || /机器人/i.test(String(m.nick || ''))
  if (!maybeBot) return false
  const text = String(m.content ?? '')
  return DRAW_RE_1.test(text) || DRAW_RE_2.test(text)
}

/** 规范化为 RobotResultCard 所需 props */
function normalizePayload(m: any): RobotCardProps {
  if (m?.payload && m.type === 'robot_draw') {
    const sumNum = Number(m.payload.sum)
    return {
      issue: m.payload.issue,
      nums: m.payload.nums as (string|number)[],
      sum: sumNum,
      label: (m.payload.label && String(m.payload.label)) || buildLabel(sumNum),
      openedAt: m.payload.openedAt,
    }
  }
  const raw = String(m?.content ?? '').replace(/\s+/g, ' ').trim()
  const mm = raw.match(DRAW_RE_1) || raw.match(DRAW_RE_2)
  if (mm) {
    const issue = mm[1]
    const n1 = Number(mm[2]), n2 = Number(mm[3]), n3 = Number(mm[4])
    const sumNum = Number(mm[5])
    const size = mm[6] as '大'|'小'|undefined
    const oddEven = mm[7] as '单'|'双'|undefined
    return {
      issue,
      nums: [n1, n2, n3],
      sum: sumNum,
      label: buildLabel(sumNum, size, oddEven),
      openedAt: undefined
    }
  }
  return { issue: '-', nums: [0,0,0], sum: '-', label: '-', openedAt: undefined }
}

/** 机器人头像（可从 props 覆盖） */
const robotAvatarUrl = computed(() => props.robotAvatar || '/assets/robot.png')
</script>

<style scoped>
.chat-list {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  background: #f3f6fb;
  padding: 0 10px 10px;
}
.inner { will-change: transform; }

.top-indicator {
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  padding: 10px 0 6px;
}
.spinner {
  display: inline-block;
  width: 12px; height: 12px;
  margin-right: 6px;
  border: 2px solid #9ca3af; border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.time-sep {
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  padding: 6px 0;
}

.row {
  display: flex;
  gap: 8px;
  margin: 10px 0;
  align-items: flex-start;
}
.row.self { flex-direction: row-reverse; }

.avatar-wrap { position: relative; width: 40px; height: 40px; flex-shrink: 0; }
.avatar {
  width: 40px; height: 40px; border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
  object-fit: cover;
}
.avatar.fallback {
  display:flex; align-items:center; justify-content:center;
  background:#e5e7eb; color:#374151; font-weight:700;
  font-size: 14px; border-radius: 50%;
}
.vip-badge {
  position: absolute; top: -6px; left: -6px;
  padding: 0 6px; height: 18px; line-height: 18px;
  background: linear-gradient(90deg,#f59e0b,#fbbf24);
  color: #111827; font-weight: 800; font-size: 10px;
  border-radius: 9px; box-shadow: 0 2px 6px rgba(245,158,11,.3);
}

.msg-col { max-width: 78%; }
.msg-col.right { align-items: flex-end; display: flex; flex-direction: column; }
.meta {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #6b7280; margin: 0 4px 4px;
}
.meta.right { justify-content: flex-end; }
.nick { font-weight: 700; color: #374151; }
.meta .dot { opacity: .6; }

.bubble {
  position: relative;
  background: #ffffff; border-radius: 16px; padding: 8px 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  word-break: break-word;
}
.bubble.self { background: #d7f7c6; }
.bubble.bot  { background: #e8f3ff; }

.tail {
  position: absolute; bottom: 8px; left: -6px;
  width: 0; height: 0; border: 6px solid transparent; border-right-color: currentColor;
  color: #ffffff;
}
.bubble.bot .tail { color: #e8f3ff; }
.bubble.self .tail {
  left: auto; right: -6px; border: 6px solid transparent; border-left-color: #d7f7c6;
}

.content { font-size: 14px; line-height: 1.65; }
.bottom-spacer { height: 4px; }

/* 回底部按钮 */
.scroll-bottom{
  position: absolute; right: 16px; bottom: 16px;
  width: 40px; height: 40px; border-radius: 20px;
  border: none; background: #2563eb; color: #fff;
  box-shadow: 0 6px 16px rgba(37,99,235,.3);
  display: flex; align-items: center; justify-content: center;
}
.scroll-bottom svg { fill: #fff; transform: rotate(180deg); }
.badge{
  position: absolute; top: -6px; right: -6px;
  min-width: 20px; height: 20px; border-radius: 10px;
  background: #ef4444; color:#fff; font-size: 12px;
  display: inline-flex; align-items:center; justify-content:center; padding: 0 4px;
}
</style>
