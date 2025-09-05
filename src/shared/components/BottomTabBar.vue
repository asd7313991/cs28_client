<template>
  <nav class="btm-wrap">
    <button
      class="btm-item"
      :class="{ active: isActive('/') || isActive('/home') }"
      @click="go('/')"
    >
      <HomeIcon class="icon"/>
      <span>大厅</span>
    </button>

    <button
      class="btm-item"
      :class="{ active: isActive('/orders') }"
      @click="go('/orders')"
    >
      <ViewListIcon class="icon"/>
      <span>订单</span>
    </button>

    <button
      class="btm-item"
      :class="{ active: isActive('/user') }"
      @click="go('/user')"
    >
      <UserIcon class="icon"/>
      <span>我的</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { HomeIcon, ViewListIcon, UserIcon } from 'tdesign-icons-vue-next'

const route = useRoute()
const router = useRouter()

function isActive(path: string) {
  // 允许前缀匹配（如 /orders/detail/100）
  return route.path === path || route.path.startsWith(path + '/')
}

function go(path: string) {
  if (route.path !== path) router.push(path)
}
</script>

<style scoped>
/* 固定在底部，安全区适配 */
.btm-wrap{
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border-top: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 -6px 20px rgba(0,0,0,.06);
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
}

/* 按钮化，去除 a 标签默认下划线/紫色访问态 */
.btm-item{
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 0;
  background: transparent;
  width: 100%;
  padding: 4px 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #667085; /* 默认文字色 */
  font-size: 12px;
}

.btm-item .icon{
  width: 22px;
  height: 22px;
}

/* 激活态：主色（与你主题蓝一致） */
.btm-item.active{
  color: var(--td-brand-color, #2a7fff);
  font-weight: 600;
}

.btm-item:active{
  opacity: .85;
}
</style>
