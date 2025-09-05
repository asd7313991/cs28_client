<template>
  <!-- 预热用音频节点（隐藏） -->
  <audio ref="dingEl" :src="dingUrl" preload="auto" hidden></audio>

  <div class="page">
    <!-- 顶部导航 -->
    <div class="topbar">
      <t-icon name="chevron-left" size="20" @click="goBack" />
      <div class="title">加拿大28【4.2-4.6】</div>
      <div class="actions">
        <div class="online"><t-icon name="usergroup" size="18" /> {{ onlineCount }}</div>
        <t-icon name="more" size="20" />
      </div>
    </div>

    <!-- 信息行 -->
    <div class="info-row">
      <div class="left">
        <span class="issue">第 {{ currentIssue }} 期开奖</span>
        <span class="dot">|</span>
        <span class="cd"><span class="cd-num">{{ status==='sealed' ? '封盘中' : mmss }}</span></span>
      </div>
      <div class="divider"></div>
      <div class="right">
        <span>账户余额</span>
        <span class="money">{{ balance.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 结果条 + 历史面板 -->
    <div class="history-wrap">
      <div class="result-strip">
        <div class="res">
          <span class="label">第 {{ lastIssue ?? '-' }} 期开奖结果</span>
          <div class="balls">
            <span class="ball">{{ lastA }}</span><span class="plus">+</span>
            <span class="ball">{{ lastB }}</span><span class="plus">+</span>
            <span class="ball gray">{{ lastC }}</span><span class="eq">=</span>
            <span class="sum">{{ lastSum }}</span><span class="txt">{{ lastLabel }}</span>
          </div>
        </div>
        <t-icon name="chevron-down" size="18" class="toggle" :class="{ open: showHistory }" @click="showHistory = !showHistory" />
      </div>

      <transition name="slide">
        <div v-show="showHistory" class="history-panel overlay">
          <div class="thead">
            <div>期号</div><div>开奖时间</div><div class="th-result">开奖结果</div>
          </div>
          <div class="row" v-for="r in history" :key="r.issue">
            <div class="issue-link" @click="goIssue(r.issue)">{{ r.issue }}</div>
            <div class="time">{{ r.time }}</div>
            <div class="result">
              <span class="ball">{{ r.a }}</span><span class="plus">+</span>
              <span class="ball">{{ r.b }}</span><span class="plus">+</span>
              <span class="ball gray">{{ r.c }}</span><span class="eq">=</span>
              <span class="sum">{{ r.sum }}</span><span class="txt">{{ r.label }}</span>
            </div>
          </div>
          <div class="more" @click="onMoreHistory"><t-icon name="search" size="16" /> 查看更多开奖记录</div>
        </div>
      </transition>
    </div>

    <!-- 聊天区 -->
    <div class="section-title">聊天室</div>
    <div class="chat-main">
      <ChatList :messages="chatMessages" :hasMore="hasMore" :selfNick="userNick" @loadMore="loadMore" />
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar safe-area-bottom">
      <button class="bar-item" @click="onCredit"><span class="icon">信</span><span>信用</span></button>
      <button class="bar-item" @click="showDesk = true"><span class="icon">桌</span><span>桌投</span></button>
      <button class="bar-item" @click="showDrawer = true"><span class="icon">快</span><span>快投</span></button>
      <button class="bar-item" @click="onMore"><span class="icon">⋯</span><span>更多</span></button>
    </div>

    <!-- 输入区 -->
    <div class="chat-input" :class="{ sealed: status==='sealed' }">
      <t-input
        v-model="text"
        :placeholder="status==='sealed' ? '封盘中，暂不可下注' : '输入文字指令下注'"
        :disabled="status==='sealed'"
        @keyup.enter="status!=='sealed' && sendChat()"
      />
      <t-button theme="primary" :disabled="status==='sealed'" @click="sendChat">发送</t-button>
      <t-button variant="outline" :disabled="status==='sealed'" @click="showDrawer = true">快投</t-button>
    </div>

    <!-- 快投抽屉 -->
    <QuickBetDrawer v-model="showDrawer">
      <div class="qb">
        <t-textarea v-model="quickText" placeholder="示例：大300丨小300（最多10条）" :maxlength="120" />
        <t-button block theme="primary" :disabled="status==='sealed'" @click="submitQuickBet">确认下单</t-button>
      </div>
    </QuickBetDrawer>

    <!-- 桌投抽屉：用 t-popup -->
    <t-popup
      v-model="showDesk"
      placement="bottom"
      :style="{ height: '60vh', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }"
    >
      <TableBetPanel v-if="oddsList.length" :items="oddsList" />
      <div v-else class="loading">加载中...</div>
    </t-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
import ChatList from '@/shared/components/ChatList.vue'
import QuickBetDrawer from '@/shared/components/QuickBetDrawer.vue'
import TableBetPanel from '@/shared/components/TableBetPanel.vue'
import { parseQuickBet } from '@/shared/utils/quickbet'
import type { QuickBetItem } from '@/shared/utils/quickbet'
import { useAuthStore } from '@/app/store/auth'
import { useChatStore } from '@/stores/chat'
import { getLast, getHistory, type HistoryRow } from '@/features/room/api/lottery'
import { odds } from '@/features/bet/api'
import dingMp3 from '@/assets/mp3/ding.mp3'

/* 展开/收起历史 */
const showHistory = ref(false)

/* 桌投/快投抽屉 */
const showDesk = ref(false)
const showDrawer = ref(false)

/* 赔率数据 */
const oddsList = ref<any[]>([])
async function fetchOdds() {
  try {
    const res = await odds('jnd28')   // http 未解包，要取 .data
    const list = res.data
    oddsList.value = list.filter((o: any) => o.status === 1).map((o: any) => ({
      play: o.name,   // ✅ name 即唯一 play
      name: o.name,
      odds: o.odds,
    }))
  } catch (e) {
    console.warn('fetchOdds error', e)
  }
}

/* —— 其余逻辑保持不变（开奖、历史、聊天、快投） —— */

/* 生命周期 */
onMounted(() => {
  fetchOdds()
  fetchLatest()
  fetchHistoryOnce()
  startPoll()
  startTick()
  addUnlockListeners()
})
onUnmounted(() => {
  stopTick()
  stopPoll()
  removeUnlockListeners()
})
</script>

<style scoped>
/* 保持原样式，这里只加桌投弹层 */
:deep(.t-popup) {
  max-height: 60vh;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow-y: auto;
}
</style>
