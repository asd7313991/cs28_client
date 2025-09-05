<!-- src/pages/Home.vue -->
<template>
  <div class="home-page">
    <!-- 1) Banner 轮播 -->
    <div class="home-banner">
      <t-swiper :autoplay="true" :interval="3000" :loop="true" :height="168" class="banner-swiper">
        <t-swiper-item v-for="(b, i) in banners" :key="i">
          <img :src="b" alt="" class="banner-img" />
        </t-swiper-item>
      </t-swiper>
    </div>

    
    <div class="home-notice">
      <div class="notice-label">公告：</div>
      <!-- 不再用 t-notice-bar，直接用兜底组件 -->
      <MarqueeBar class="notice-bar" :text="noticeText" :duration="14" />
    </div>



    <!-- 3) 四宫格入口 -->
    <div class="home-actions">
      <t-grid :column="4" :gutter="12">
        <t-grid-item @click="goRecharge">
          <template #image><RechargeIcon class="act-icon" /></template>
          <span>我要充值</span>
        </t-grid-item>
        <t-grid-item @click="goWithdraw">
          <template #image><WalletIcon class="act-icon" /></template>
          <span>我要提现</span>
        </t-grid-item>
        <t-grid-item @click="goDownload">
          <template #image><DownloadIcon class="act-icon" /></template>
          <span>APP下载</span>
        </t-grid-item>
        <t-grid-item @click="goNotice">
          <template #image><AppIcon class="act-icon" /></template>
          <span>公告中心</span>
        </t-grid-item>
      </t-grid>
    </div>

    <!-- 4) 热门彩种 -->
    <div class="section">
      <div class="section-title">热门彩种</div>
      <div class="game-card" v-for="g in games" :key="g.id" :style="{ background: g.bg }" @click="goRoom(g)">
        <div class="gc-left">
          <div class="gc-name">{{ g.name }}</div>
          <div class="gc-sub">{{ g.period }}</div>
          <div class="gc-time">{{ g.time }}</div>
          <t-button size="small" theme="primary" variant="base" class="gc-btn">游戏介绍</t-button>
        </div>
        <div class="gc-right">
          <img :src="g.img" alt="" class="gc-img" />
        </div>
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>

<script setup lang="ts">
import BottomTabBar from '@/components/BottomTabBar.vue'
import { MoneyIcon as RechargeIcon, WalletIcon, DownloadIcon, AppIcon } from 'tdesign-icons-vue-next'
import MarqueeBar from '@/components/MarqueeBar.vue'

/* ✅ 从 src/assets/banner/ 静态导入 */
import b1 from '@/assets/banner/1.jpg'
import b2 from '@/assets/banner/2.jpg'
import b3 from '@/assets/banner/3.jpg'
const banners = [b1, b2, b3]

const notices = [
  '欢迎来到CS28娱乐平台，新老会员活动多多，福利多多～',
  '温馨提示：封盘前15秒禁止下单，敬请留意～',
  '新手礼包开放中，详情见活动页～',
]
const noticeText = notices.join(' ｜ ')

// 速度可按需调：文本越长，时间越久
const marqueeDuration = Math.max(12, Math.ceil(noticeText.length / 2))



const games = [
  { id: 201, name: '台湾水果28', period: '5分钟/期',  time: '开奖时间：07:05-23:55', bg: 'linear-gradient(135deg,#ffb65b 0%,#ff7f34 100%)', img: 'https://picsum.photos/seed/tw/220/160' },
  { id: 202, name: '加拿大28',   period: '3分30秒/期', time: '开奖时间：20:00-21:00', bg: 'linear-gradient(135deg,#ff7aa3 0%,#ff4d6d 100%)', img: 'https://picsum.photos/seed/ca/220/160' },
  { id: 203, name: '红包接龙',   period: '3分30秒/期', time: '开奖时间：全天',        bg: 'linear-gradient(135deg,#f7b733 0%,#fc4a1a 100%)', img: 'https://picsum.photos/seed/hb/220/160' },
]

function goRoom(g:any){ location.assign(`/room/${g.id}`) }
function goRecharge(){} function goWithdraw(){} function goDownload(){} function goNotice(){}
</script>

<style scoped>
.home-page{ padding-bottom:72px; background:var(--td-bg-color-page); }
.home-banner{ padding:12px 12px 0; }
.banner-swiper{ border-radius:16px; overflow:hidden; }
.banner-img{ width:100%; height:168px; object-fit:cover; display:block; }

.home-notice{ display:flex; align-items:center; gap:8px; padding:8px 12px 0; }
.notice-label{ color:#6b7280; font-size:14px; white-space:nowrap; }
.notice-bar{ flex:1; }

.home-actions{ padding:8px 12px; }
.act-icon{ width:28px; height:28px; color:var(--td-brand-color); }

.section{ padding:12px; }
.section-title{ font-weight:600; padding:8px 4px; }

.game-card{
  display:grid; grid-template-columns:1fr 120px; align-items:center;
  padding:14px 12px 14px 16px; border-radius:18px; color:#fff;
  box-shadow:0 8px 24px rgba(0,0,0,.12); margin-bottom:14px;
}
.gc-left .gc-name{ font-size:18px; font-weight:800; margin-bottom:6px; }
.gc-left .gc-sub,.gc-left .gc-time{ font-size:12px; opacity:.95; line-height:1.4; }
.gc-btn{ margin-top:10px; --td-btn-color:#fff; --td-btn-bg-color:rgba(255,255,255,.18); --td-btn-border-color:transparent; backdrop-filter:blur(2px); }
.gc-right{ display:flex; justify-content:flex-end; }
.gc-img{ width:110px; height:110px; object-fit:cover; border-radius:14px; box-shadow:0 6px 20px rgba(0,0,0,.18); }

/* 公告布局 */
.home-notice { display:flex; align-items:center; gap:8px; padding:8px 12px 0; }
.notice-label { color:#6b7280; font-size:14px; white-space:nowrap; }
.notice-bar { flex:1; }

/* 跑马灯轨道 */
.marquee { overflow: hidden; }
.marquee-track {
  display: inline-flex;
  gap: 2rem;
  white-space: nowrap;
  will-change: transform;
  animation-name: nb-marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.marquee-item { white-space: nowrap; }
@keyframes nb-marquee {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); } /* 两段拼接无缝循环 */
}

.home-notice { display:flex; align-items:center; gap:8px; padding:8px 12px 0; }
.notice-label { color:#6b7280; font-size:14px; white-space:nowrap; }
.notice-bar { flex:1; }
</style>
