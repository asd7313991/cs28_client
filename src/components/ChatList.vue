<template>
  <div ref="wrap" class="chat-wrap" @scroll.passive="onScroll">
    <div class="load-more" v-if="hasMore" @click="loadMore">上拉加载更多</div>
    <div v-for="m in messages" :key="m.id" class="msg" :class="m.type">
      <div class="nick">{{ m.nick }}</div><div class="content">{{ m.content }}</div>
    </div>
    <t-button v-show="!atBottom" class="to-bottom" size="small" theme="primary" @click="scrollToBottom">底部</t-button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
const props = defineProps<{ messages:any[], hasMore?:boolean }>() ; const emit = defineEmits<{(e:'loadMore'):void}>()
const wrap = ref<HTMLElement|null>(null); const atBottom = ref(true)
function onScroll(){ if(!wrap.value) return; const nearBottom = wrap.value.scrollHeight - wrap.value.scrollTop - wrap.value.clientHeight < 10; atBottom.value = nearBottom }
function scrollToBottom(){ if(!wrap.value) return; wrap.value.scrollTo({ top: wrap.value.scrollHeight, behavior: 'smooth' }); atBottom.value = true }
function loadMore(){ emit('loadMore') }
watch(()=>props.messages.length, async()=>{ await nextTick(); if(atBottom.value) scrollToBottom() })
onMounted(()=>{ scrollToBottom() })
</script>
<style scoped>
.chat-wrap{position:relative;height:60vh;overflow-y:auto;padding:8px 12px 48px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.04);}
.msg{padding:6px 8px;margin-bottom:6px;border-radius:8px;background:#f5f7fa;}
.msg.gm{background:#e8f1ff;} .msg.robot{background:#fff7e6;}
.nick{font-size:12px;color:#6b7280;} .content{font-size:14px;color:#111827;}
.to-bottom{position:absolute;right:12px;bottom:8px;z-index:10;} .load-more{text-align:center;color:#6b7280;font-size:12px;padding:4px 0 8px;}
</style>
