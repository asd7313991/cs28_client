import request from '@/shared/api/http'

export const getPing = () => request.get('/ping')
export const getCurrent = (code: string) => request.get('/lottery/current', { params: { code } })
export const getLast = (code: string) => request.get('/lottery/last', { params: { code } })
export const getHistory = (code: string, limit = 10) => request.get('/lottery/history', { params: { code, limit } })
