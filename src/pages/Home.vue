<template>
  <div class="page">
    <div class="banner"><t-swiper :autoplay="true" :interval="3000">
      <t-swiper-item v-for="(b,i) in banners" :key="i"><img :src="b" class="banner-img"/></t-swiper-item>
    </t-swiper></div>
    <div class="notice"><t-notice-bar content="公告：欢迎来到CS28娱乐平台，新老会员活动多多，福利多多~"/></div>
    <div class="quick-actions"><t-grid :column="4">
      <t-grid-item text="我要充值"/><t-grid-item text="我要提现"/><t-grid-item text="APP下载"/><t-grid-item text="公告中心"/>
    </t-grid></div>
    <div class="section"><div class="section-title">热门彩种</div>
      <div class="rooms">
        <t-card v-for="g in games" :key="g.id" :title="g.name" :subtitle="g.desc" bordered @click="goRoom(g)">
          <template #actions><t-button size="small" variant="outline">游戏介绍</t-button></template>
        </t-card>
      </div>
    </div>
    <BottomTabBar/>
  </div>
</template>
<script setup lang="ts">
import BottomTabBar from '@/components/BottomTabBar.vue'
const banners=['https://picsum.photos/800/300?1','https://picsum.photos/800/300?2','https://picsum.photos/800/300?3']
const games=[{id:101,name:'台湾水果28',desc:'5分钟/期 开奖: 07:05-23:55'},{id:102,name:'加拿大28',desc:'3分30秒/期 开奖: 20:00-21:00'},{id:103,name:'红包接龙',desc:'3分30秒/期 开奖: 全天'}]
function goRoom(g:any){ location.assign(`/room/${g.id}`) }
</script>
<style scoped>
.page{padding-bottom:64px;} .banner-img{width:100%;display:block;} .section{padding:12px;} .section-title{font-weight:600;padding:8px 4px;} .rooms :deep(.t-card){margin-bottom:12px;border-radius:16px;} .notice{padding:8px 12px;} .quick-actions{padding:8px 12px;}
</style>
