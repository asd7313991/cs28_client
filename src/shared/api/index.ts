import http from './http'
export const Api = {
  auth: { login: (p:{username:string;password:string}) => http.post('/auth/login', p), me: () => http.get('/user/me') },
  game: { issues: (lotteryId:number, limit=50) => http.get('/game/issues', { params:{ lotteryId, limit } }), roomInfo: (roomId:number) => http.get('/game/room', { params:{ roomId } }) },
  order: { place: (payload:any) => http.post('/order/place', payload), cancel: (payload:any) => http.post('/order/cancel', payload), list: (params:any) => http.get('/order/list', { params }) },
  chat: { history: (roomId:number, cursor?:string, limit=30) => http.get('/chat/history', { params:{ roomId, cursor, limit } }) },
}
