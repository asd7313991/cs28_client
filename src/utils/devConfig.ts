// src/utils/devConfig.ts
export type DevConfig = {
  enable?: boolean
  auth?: { isAuthed?: boolean; user?: { id?: number | string; nick?: string } }
  wallet?: { balance?: number }
  room?: {
    status?: 'open' | 'sealed' | 'done'
    countdownMs?: number
    currentIssue?: number
    lastIssue?: number
  }
}

export async function loadDevConfig(): Promise<DevConfig | null> {
  try {
    const res = await fetch(`/dev-config.json?ts=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = (await res.json()) as DevConfig
    return json || null
  } catch {
    return null
  }
}
