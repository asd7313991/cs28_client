<template>
  <div class="page">
    <div class="room-header">
      <div class="left"><div class="name">房间 {{ roomId }}</div><div class="timer">距封盘：<t-countdown :time="countdown" format="mm:ss"/></div></div>
      <div class="right"><t-button size="small" @click="toggleCurtain">开奖列表</t-button><t-button size="small" variant="outline" @click="showDrawer = true">快投</t-button></div>
    </div>
    <CurtainPanel v-model="showCurtain"><div class="curtain-content"><div class="title">开奖记录</div><t-cell v-for="i in 10" :key="i" :title="'第'+(10000+i)+'期'" :description="'号码：'+(i%28)"/></div></CurtainPanel>
    <div class="chat-title">聊天室 <span v-if="!isAuthed" class="guest">（游客模式）</span></div>
    <ChatList :messages="messages" :hasMore="hasMore" @loadMore="loadMore"/>
    <div class="chat-input safe-area-bottom"><t-input v-model="text" :placeholder="isAuthed ? '发一条消息' : '游客模式，登录后可发言'}" :disabled="!isAuthed"/><t-button theme="primary" :disabled="!isAuthed" @click="sendChat">发送</t-button></div>
    <QuickBetDrawer v-model="showDrawer"><div class="qb"><t-textarea v-model="quickText" placeholder="示例：大300丨小300（最多10条）"/><t-button block theme="primary" @click="submitQuickBet">确认下单</t-button></div></QuickBetDrawer>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import CurtainPanel from '@/components/CurtainPanel.vue'
import QuickBetDrawer from '@/components/QuickBetDrawer.vue'
import ChatList from '@/components/ChatList.vue'
import { parseQuickBet } from '@/utils/quickbet'
import { Toast } from 'tdesign-mobile-vue'
const route = useRoute(); const roomId = Number(route.params.id); const countdown = 90_000
const showCurtain = ref(false); const showDrawer = ref(false); const quickText = ref(''); const text = ref('')
const auth = useAuthStore(); const isAuthed = computed(()=>auth.isAuthed)
const chat = useChatStore(); const messages = computed(()=>chat.messages); const hasMore = computed(()=>chat.hasMore)
function toggleCurtain(){ showCurtain.value = !showCurtain.value }
function loadMore(){ const more = Array.from({length:30}).map((_,i)=>({id:'h'+Date.now()+i,nick:'历史',content:'历史消息 '+i,ts:Date.now()-i*1000})); chat.prepend(more as any) }
function sendChat(){ if(!text.value.trim()) return; chat.push({id:Date.now()+'',nick:'我',content:text.value,ts:Date.now()}); text.value='' }
function submitQuickBet(){ try{ const items = parseQuickBet(quickText.value); if(!items.length) throw new Error('格式不正确'); Toast.success('已提交下单'); showDrawer.value=false } catch(e:any){ Toast.error(e.message||'下单失败') } }
</script>
<style scoped>
.page{padding:12px 12px 80px;}
.room-header{display:flex;align-items:center;justify-content:space-between;background:#fff;padding:10px 12px;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 12px rgba(0,0,0,.04);}
.name{font-weight:700;margin-bottom:4px;} .timer{font-size:12px;color:#374151;}
.chat-title{margin:8px 4px;font-weight:600;} .guest{color:#6b7280;font-weight:400;}
.chat-input{position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;padding:8px 12px;background:#fff;box-shadow:0 -2px 8px rgba(0,0,0,.04);}
.qb{display:grid;gap:8px;} .curtain-content .title{font-weight:600;padding:4px 0 8px;}
</style>
