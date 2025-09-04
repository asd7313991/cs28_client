<template><div class="page"><t-cell v-for="i in 8" :key="i" :title="'订单#'+i" :description="'状态：已提交 / 金额：'+(i*10)"/><BottomTabBar/></div></template>
<script setup lang="ts">import BottomTabBar from '@/components/BottomTabBar.vue'</script>
<style scoped>.page{padding-bottom:64px;}</style>
