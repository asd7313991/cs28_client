// src/stores/chat.ts
import { defineStore } from 'pinia'

export type ChatMsgType = 'user' | 'bot' | 'system'

export interface ChatMsg {
  id: string
  type: ChatMsgType
  nick: string
  content: string
  ts: number
  avatar?: string
  vip?: number
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMsg[],
    hasMore: true,
    _lastBotTs: 0, // 频率限制：机器人 1秒/条
  }),
  actions: {
    push(msg: ChatMsg | ChatMsg[]) {
      if (Array.isArray(msg)) {
        this.messages.push(...msg)
      } else {
        this.messages.push(msg)
      }
    },
    prepend(msgs: ChatMsg[]) {
      this.messages.unshift(...msgs)
    },

    // 通用机器人发言
    bot(text: string) {
      const now = Date.now()
      if (now - this._lastBotTs < 1000) return
      this._lastBotTs = now
      this.push({
        id: String(now),
        type: 'bot',
        nick: '鼎尚国际机器人',
        content: text,
        ts: now,
        avatar: '/assets/bot.png', // 自行放一个机器人头像
      })
    },

    // 【本需求】下注播报：格式如 “Bauer：大双1856|单6134”
    botAnnounceBet(payload: { nick: string; bets: Array<{ label: string; amount: number }> }) {
      const parts = payload.bets.map(b => `${b.label}${b.amount}`).join('|')
      this.bot(`${payload.nick}：${parts}`)
    },
  },
})
