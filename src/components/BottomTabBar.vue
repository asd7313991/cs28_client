<template>
  <t-tab-bar v-model="active" fixed class="safe-area-bottom" @change="onChange">
    <t-tab-bar-item value="Home"><template #icon><HomeIcon/></template>首页</t-tab-bar-item>
    <t-tab-bar-item value="Hall"><template #icon><AppIcon/></template>大厅</t-tab-bar-item>
    <t-tab-bar-item value="Activity"><template #icon><ActivityIcon/></template>活动</t-tab-bar-item>
    <t-tab-bar-item value="User"><template #icon><UserIcon/></template>我的</t-tab-bar-item>
  </t-tab-bar>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeIcon, AppIcon, ActivityIcon, UserIcon } from 'tdesign-icons-vue-next'
const router = useRouter(); const route = useRoute(); const active = ref('Home')
watch(()=>route.name,(name)=>{ if (typeof name==='string' && ['Home','Hall','Orders','Activity','User'].includes(name)) active.value=name },{immediate:true})
function onChange(val:string){ const map:Record<string,string>={Home:'/',Hall:'/hall',Activity:'/activity',User:'/user'}; router.push(map[val]||'/') }
</script>
<style scoped>:deep(.t-tab-bar){box-shadow:0 -2px 8px rgba(0,0,0,0.04);}</style>
