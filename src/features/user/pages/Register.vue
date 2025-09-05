<template>
  <div class="page p-4">
    <div class="title">快速注册</div>

    <t-form :rules="rules" :data="form" @submit="onSubmit">
      <t-form-item name="username" label="用户名">
        <t-input v-model="form.username" placeholder="请输入用户名" clearable />
      </t-form-item>
      <t-form-item name="password" label="密码">
        <t-input v-model="form.password" type="password" placeholder="6-20位密码" clearable />
      </t-form-item>
      <t-form-item name="confirm" label="确认密码">
        <t-input v-model="form.confirm" type="password" placeholder="再次输入" clearable />
      </t-form-item>

      <div class="mt-3">
        <t-button theme="primary" block type="submit" :loading="loading">注册并去登录</t-button>
      </div>
      <div class="helper">
        已有账号？
        <span class="link" @click="goLogin">去登录</span>
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

const form = reactive({
  username: '',
  password: '',
  confirm: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '不少于6位' }],
  confirm: [{ validator: (v: string) => v === form.password, message: '两次输入不一致' }],
}

async function onSubmit() {
  loading.value = true
  try {
    await auth.register(form.username, form.password)
    Toast.success({ content: '注册成功，请登录', duration: 1200 })
    router.replace({ name: 'login', query: { redirect: route.query.redirect as string } })
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.response?.data?.message || '注册失败'
    Toast.warning({ content: String(msg), duration: 1500 })
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push({ name: 'login', query: { redirect: route.query.redirect as string } })
}
</script>

<style scoped>
.p-4 { padding: 16px; }
.title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
.mt-3 { margin-top: 12px; }
.helper { margin-top: 10px; font-size: 13px; color: #666; }
.link { color: var(--td-brand-color, #0052d9); cursor: pointer; }
</style>
