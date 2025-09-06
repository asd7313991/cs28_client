// src/shared/lib/message.ts
import Message from 'tdesign-mobile-vue/es/message'

// 复用官方方法的精确类型（参数/返回值）
type InfoParam = Parameters<(typeof Message)['info']>[0]
type SuccessParam = Parameters<(typeof Message)['success']>[0]
type WarningParam = Parameters<(typeof Message)['warning']>[0]
type ErrorParam = Parameters<(typeof Message)['error']>[0]
type CloseAll = (typeof Message)['closeAll']

// 统一默认项
const baseDefaults = {
  duration: 3000,
  icon: true,
  zIndex: 20000,
  offset: [10, 16],
} as const

function call<T extends keyof typeof Message>(
  theme: T,
  options?: Parameters<(typeof Message)[T]>[0],
  fallbackContent?: string,
  fallbackDuration?: number
) {
  const fn = (Message as any)[theme] as (opts?: any) => any

  if (typeof options === 'string' || options === undefined) {
    // 允许直接传字符串或不传
    return fn({
      ...baseDefaults,
      content: options ?? fallbackContent ?? '',
      duration: fallbackDuration ?? baseDefaults.duration,
    })
  }
  // 传对象时合并默认项（用户传入的优先级更高）
  return fn({ ...baseDefaults, ...options })
}

export const message = {
  // 额外提供一个 show 语法糖：message.show('info', '文本', 3000)
  show(theme: 'info' | 'success' | 'warning' | 'error', content: string, duration = 3000) {
    return call(theme as any, content, content, duration)
  },

  // 下列四个方法的签名与官方保持一致（string | options）
  info(options?: InfoParam) {
    return call('info', options, '提示')
  },
  success(options?: SuccessParam) {
    return call('success', options, '操作成功')
  },
  warning(options?: WarningParam) {
    return call('warning', options, '请注意')
  },
  error(options?: ErrorParam) {
    return call('error', options, '出错啦')
  },

  // 与官方对齐
  closeAll: (Message as any).closeAll as CloseAll,
}

// 供注入/类型提示使用（推荐用这个类型）
export type MessageApi = typeof message

export default message
