<!-- src/features/user/pages/User.vue -->
<template>
  <div class="page">
    <div class="section">
      <t-cell
        title="昵称"
        :description="auth.user?.nick || '未设置'"
      />
      <t-cell
        title="余额"
        description="¥0.00"
      />
      <t-cell
        title="退出登录"
        arrow
        @click="logout"
      />
    </div>

    <BottomTabBar />
  </div>
</template>

<script setup lang="ts">
import BottomTabBar from '@/shared/components/BottomTabBar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

function logout() {
  auth.setToken(null)
  location.replace('/')
}
</script>

<style scoped>
.page {
  padding-bottom: 64px;
}
.section {
  padding: 12px;
}
</style>
