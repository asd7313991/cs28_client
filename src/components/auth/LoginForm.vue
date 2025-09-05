<template>
  <t-form ref="formRef" :rules="rules" :data="form" @submit="onSubmit">
    <t-form-item name="account" label="账号">
      <t-input v-model="form.account" placeholder="手机号/邮箱/用户名" clearable />
    </t-form-item>
    <t-form-item name="password" label="密码">
      <t-input v-model="form.password" type="password" placeholder="请输入密码" clearable />
    </t-form-item>

    <t-form-item v-if="needCaptcha" name="captcha" label="验证">
      <div class="row">
        <t-input v-model="form.captcha" placeholder="图形验证码" />
        <img :src="captchaUrl" class="captcha" @click="refreshCaptcha" alt="captcha" />
      </div>
    </t-form-item>

    <div class="mt-3">
      <t-button theme="primary" block type="submit" :loading="loading">登录</t-button>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/app/store/auth'
import { apiAuth } from '@/app/api/auth'

const auth = useAuthStore()
const loading = ref(false)
const needCaptcha = ref(true) // 如后端按风控返回，可改成动态
const form = reactive({ account: '', password: '', captcha: '', captcha_key: '' })
const formRef = ref()

const rules = {
  account: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: () => needCaptcha.value, message: '请输入验证码' }],
}

const captchaUrl = computed(() => form.captcha_key ? apiAuth.captchaImage(form.captcha_key) : '')
function refreshCaptcha() { form.captcha_key = `${Date.now()}-${Math.random().toString(16).slice(2)}` }
onMounted(() => { if (needCaptcha.value) refreshCaptcha() })

async function onSubmit() {
  loading.value = true
  try {
    await auth.login(form.account, form.password,
      needCaptcha.value ? { captcha: form.captcha, captcha_key: form.captcha_key } : {})
    Toast.success({ content: '登录成功', duration: 1200 })
    emit('success')
  } catch (e: any) {
    Toast.warning({ content: e?.response?.data?.message || '登录失败', duration: 1500 })
    if (needCaptcha.value) refreshCaptcha()
  } finally { loading.value = false }
}
const emit = defineEmits(['success'])
</script>

<style scoped>
.row{ display:flex; align-items:center; gap:8px }
.captcha{ height:36px; border-radius:6px; cursor:pointer }
.mt-3{ margin-top:12px }
</style>
