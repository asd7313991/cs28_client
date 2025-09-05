import request from '@/utils/request'

export function getPing() {
  return request.get('/ping')
}

export function getCurrent(code: string) {
  return request.get('/lottery/current', { params: { code } })
}

export function getLast(code: string) {
  return request.get('/lottery/last', { params: { code } })
}

export function getHistory(code: string, limit = 10) {
  return request.get('/lottery/history', { params: { code, limit } })
}
