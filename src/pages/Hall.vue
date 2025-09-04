<template>
  <div class="page">
    <div class="section"><div class="section-title">全部彩种</div>
      <div class="rooms"><t-cell v-for="g in games" :key="g.id" :title="g.name" :description="g.desc" arrow @click="goRoom(g)"/></div>
    </div>
    <BottomTabBar/>
  </div>
</template>
<script setup lang="ts">
import BottomTabBar from '@/components/BottomTabBar.vue'
const games=[{id:101,name:'台湾水果28',desc:'5分钟/期 开奖: 07:05-23:55'},{id:102,name:'加拿大28',desc:'3分30秒/期 开奖: 20:00-21:00'},{id:103,name:'红包接龙',desc:'3分30秒/期 开奖: 全天'}]
function goRoom(g:any){ location.assign(`/room/${g.id}`) }
</script>
<style scoped>.page{padding-bottom:64px;} .section{padding:12px;} .section-title{font-weight:600;padding:8px 4px;}</style>
