<!-- src/pages/Home.vue -->
<template>
  <div class="home-page">
    <!-- 1) Banner 轮播 -->
    <div class="home-banner">
      <t-swiper
        :autoplay="true"
        :interval="3000"
        :loop="true"
        :height="168"
        class="banner-swiper"
      >
        <t-swiper-item v-for="(b, i) in banners" :key="`banner-${i}`">
          <img :src="b" alt="" class="banner-img" />
        </t-swiper-item>
      </t-swiper>
    </div>

    <!-- 2) 跑马灯公告（只由 MarqueeBar 渲染“公告：”标签） -->
    <div class="home-notice">
      <MarqueeBar
        class="notice-bar"
        :text="noticeText"
        :duration="marqueeDuration"
        label="公告："
      />
    </div>

    <!-- 3) 四宫格入口（移动端：图标 + 文字） -->
    <div class="home-actions">
      <t-grid :column="4" :gutter="10">
        <t-grid-item @click="goRecharge">
          <template #image><t-icon name="wallet" class="act-icon" /></template>
          <template #text>我要充值</template>
        </t-grid-item>
        <t-grid-item @click="goWithdraw">
          <template #image><t-icon name="swap" class="act-icon" /></template>
          <template #text>我要提现</template>
        </t-grid-item>
        <t-grid-item @click="goDownload">
          <template #image><t-icon name="download" class="act-icon" /></template>
          <template #text>APP下载</template>
        </t-grid-item>
        <t-grid-item @click="goNotice">
          <template #image><t-icon name="announcement" class="act-icon" /></template>
          <template #text>公告中心</template>
        </t-grid-item>
      </t-grid>
    </div>



    <!-- 4) 热门彩种 -->
    <div class="section">
      <div class="section-title">热门彩种</div>
      <div
        class="game-card"
        v-for="g in games"
        :key="g.id"
        :style="{ background: g.bg }"
        @click="goRoom(g)"
      >
        <div class="gc-left">
          <div class="gc-name">{{ g.name }}</div>
          <div class="gc-sub">{{ g.period }}</div>
          <div class="gc-time">{{ g.time }}</div>
          <t-button size="small" theme="primary" variant="base" class="gc-btn">
            游戏介绍
          </t-button>
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
import BottomTabBar from '@/shared/components/BottomTabBar.vue'
import MarqueeBar from '@/shared/components/MarqueeBar.vue'


/** 静态 Banner 图 */
import b1 from '@/assets/banner/1.jpg'
import b2 from '@/assets/banner/2.jpg'
import b3 from '@/assets/banner/3.jpg'
const banners = [b1, b2, b3]

/** 公告文本（可替换为接口返回） */
const notices = [
  '欢迎来到CS28娱乐平台，新老会员活动多多，福利多多～',
  '温馨提示：封盘前15秒禁止下单，敬请留意～',
  '新手礼包开放中，详情见活动页～',
]
const noticeText = notices.join(' ｜ ')
/** 根据文本长度自适应滚动时长（秒） */
const marqueeDuration = Math.max(12, Math.ceil(noticeText.length / 2))

/** 热门彩种（占位数据） */
type GameItem = {
  id: number; name: string; period: string; time: string; bg: string; img: string
}
const games: GameItem[] = [
  {
    id: 201,
    name: '台湾水果28',
    period: '5分钟/期',
    time: '开奖时间：07:05-23:55',
    bg: 'linear-gradient(135deg,#ffb65b 0%,#ff7f34 100%)',
    img: 'https://picsum.photos/seed/tw/220/160',
  },
  {
    id: 202,
    name: '加拿大28',
    period: '3分30秒/期',
    time: '开奖时间：20:00-21:00',
    bg: 'linear-gradient(135deg,#ff7aa3 0%,#ff4d6d 100%)',
    img: 'https://picsum.photos/seed/ca/220/160',
  },
  {
    id: 203,
    name: '红包接龙',
    period: '3分30秒/期',
    time: '开奖时间：全天',
    bg: 'linear-gradient(135deg,#f7b733 0%,#fc4a1a 100%)',
    img: 'https://picsum.photos/seed/hb/220/160',
  },
]

function goRoom(g: GameItem) { location.assign(`/room/${g.id}`) }
function goRecharge() {}
function goWithdraw() {}
function goDownload() {}
function goNotice() {}
</script>

<style scoped>
.home-page{ padding-bottom:72px; background:var(--td-bg-color-page); }

/* Banner */
.home-banner{ padding:12px 12px 0; }
.banner-swiper{ border-radius:16px; overflow:hidden; }
.banner-img{ width:100%; height:168px; object-fit:cover; display:block; }

/* 公告（只保留一次定义，避免覆盖错乱） */
.home-notice{ padding:8px 12px 0; }
.notice-bar{ width:100%; }

/* 四宫格 */
.home-actions{ padding:8px 12px; }
.act-icon{ width:28px; height:28px; color:var(--td-brand-color); }

/* 热门彩种卡片 */
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

/* 四宫格入口（恢复旧版视觉） */
.home-actions{
  padding: 10px 12px 4px;
}
.home-actions .t-grid{
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,.06);
  padding: 10px 6px;
}
.act-icon{
  width: 28px; height: 28px;
  color: var(--td-brand-color, #2a7fff);
}
.act-text{
  display: block;
  font-size: 12px;
  color: #344054;
  margin-top: 6px;
  text-decoration: none; /* 防止出现下划线/紫色访问态 */
}
.home-actions :deep(a){
  text-decoration: none;
  color: inherit;
}

</style>
