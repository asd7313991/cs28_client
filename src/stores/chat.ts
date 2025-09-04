import { defineStore } from 'pinia'
import { ref } from 'vue'
export interface ChatMsg { id: string; userId?: number; nick: string; content: string; ts: number; type?: 'text'|'system'|'gm'|'robot' }
export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMsg[]>([])
  const hasMore = ref(true)
  function prepend(list: ChatMsg[]) { messages.value = [...list, ...messages.value] }
  function push(msg: ChatMsg) { messages.value.push(msg) }
  function reset() { messages.value = []; hasMore.value = true }
  return { messages, hasMore, prepend, push, reset }
})
