<template>
  <div class="page p-4">
    <div class="title">账号登录</div>

    <t-form :rules="rules" :data="form" @submit="onSubmit">
      <t-form-item name="username" label="用户名">
        <t-input v-model="form.username" placeholder="请输入用户名" clearable />
      </t-form-item>
      <t-form-item name="password" label="密码">
        <t-input v-model="form.password" type="password" placeholder="请输入密码" clearable />
      </t-form-item>
      <div class="mt-3">
        <t-button
          theme="primary"
          block
          type="submit"
          :loading="loading"
          :loading-props="{ theme: 'spinner', size: '20px' }"
          :disabled="loading"
        >
          {{ loading ? '登录中…' : '登录' }}
        </t-button>

      </div>
      <div class="helper">
        还没有账号？
        <span class="link" @click="goRegister">去注册</span>
      </div>
    </t-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/app/store/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loading = ref(false)
// ✅ 默认账号密码
const form = reactive({ 
  username: 'test',
  password: '123456',
})


const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}

async function onSubmit() {
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    Toast.success({ content: '登录成功', duration: 1200 })
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.response?.data?.message || '登录失败'
    Toast.warning({ content: String(msg), duration: 1500 })
  } finally {
    loading.value = false
  }
}

function goRegister() {
  router.push({ name: 'register', query: { redirect: route.query.redirect as string } })
}
</script>

<style scoped>
.p-4 { padding: 16px; }
.title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
.mt-3 { margin-top: 12px; }
.helper { margin-top: 10px; font-size: 13px; color: #666; }
.link { color: var(--td-brand-color, #0052d9); cursor: pointer; }
</style>
