<template>
  <t-form ref="formRef" :rules="rules" :data="form" @submit="onSubmit">
    <t-form-item name="account" label="账号">
      <t-input v-model="form.account" placeholder="手机号/邮箱/用户名" clearable />
    </t-form-item>
    <t-form-item name="password" label="密码">
      <t-input v-model="form.password" type="password" placeholder="6-20位密码" clearable />
    </t-form-item>
    <t-form-item name="confirm" label="确认密码">
      <t-input v-model="form.confirm" type="password" placeholder="再次输入" clearable />
    </t-form-item>

    <div class="mt-3">
      <t-button theme="primary" block type="submit" :loading="loading">注册</t-button>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/app/store/auth'

const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ account: '', password: '', confirm: '' })
const formRef = ref()

const rules = {
  account: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '不少于6位' }],
  confirm: [{ validator: (val: any) => val === form.password, message: '两次输入不一致' }],
}

async function onSubmit() {
  loading.value = true
  try {
    await auth.register(form.account, form.password)
    Toast.success({ content: '注册成功，请登录', duration: 1200 })
    emit('success')
  } catch (e: any) {
    Toast.warning({ content: e?.response?.data?.message || '注册失败', duration: 1500 })
  } finally { loading.value = false }
}
const emit = defineEmits(['success'])
</script>

<style scoped>
.mt-3{ margin-top:12px }
</style>
