<template>
  <div class="user-page">
    <!-- 顶部资料卡 -->
    <div class="profile-card">
      <div class="avatar">
        <img :src="avatarUrl" alt="avatar" />
      </div>
      <div class="info">
        <div class="username">@{{ username }}</div>
        <div class="uid">ID: {{ uid }}</div>
      </div>
    </div>

    <!-- 余额卡片 -->
    <div class="wallet-card">
      <div class="row">
        <div class="label">余额</div>
        <div class="value">
          <span class="amount">{{ displayBalance }}</span>
          <span class="currency">CNY</span>
        </div>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="actions">
      <t-button theme="primary" block @click="goRecharge">充值</t-button>
      <t-button variant="outline" block class="mt-8" @click="logout">退出登录</t-button>
    </div>

    <!-- 底部 TabBar -->
    <BottomTabBar />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/app/store/auth'
import BottomTabBar from '@/shared/components/BottomTabBar.vue'

const router = useRouter()
const auth = useAuthStore()

const username = computed(() => auth.profile?.username || '')
const uid = computed(() => auth.profile?.id || '')
const avatarUrl = computed(
  () => auth.profile?.avatar_url || 'https://static-aliyun-oss.s3.amazonaws.com/cs28/default-avatar.png',
)
const displayBalance = computed(() => {
  const n = Number(auth.profile?.balance ?? 0)
  return n.toFixed(2)
})

async function ensureProfile() {
  if (!auth.isLogin) {
    router.replace({ name: 'login', query: { redirect: '/user' } })
    return
  }
  if (!auth.profile || typeof auth.profile.balance === 'undefined') {
    await auth.fetchProfile?.()
  }
}

function goRecharge() {
  Toast.info({ content: '请联系客服充值（演示）', duration: 1200 })
}

async function logout() {
  await auth.logout()
  router.replace({ name: 'login' })
}

onMounted(() => {
  ensureProfile()
})
</script>

<style scoped>
.user-page {
  padding: 12px 12px 60px; /* 给底部 TabBar 留出空间 */
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 资料卡 */
.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #f3f8ff 0%, #eaf2ff 100%);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0,0,0,.06);
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.info { display: flex; flex-direction: column; }
.username { font-size: 16px; font-weight: 600; color: #222; }
.uid { margin-top: 2px; font-size: 12px; color: #888; }

/* 余额卡 */
.wallet-card {
  margin-top: 12px;
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}
.wallet-card .row {
  display: flex; justify-content: space-between; align-items: baseline;
}
.wallet-card .label { color: #666; font-size: 14px; }
.wallet-card .value { font-size: 18px; font-weight: 700; }
.wallet-card .amount { margin-right: 6px; }
.wallet-card .currency { font-size: 12px; color: #888; }

/* 操作区 */
.actions { margin-top: 16px; }
.mt-8 { margin-top: 8px; }
</style>
