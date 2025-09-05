<template>
  <div class="page login">
    <div class="card">
      <h2 class="title">登录</h2>
      <t-form @submit="onSubmit">
        <t-form-item name="username"><t-input v-model="username" placeholder="用户名" clearable/></t-form-item>
        <t-form-item name="password"><t-input v-model="password" type="password" placeholder="密码" clearable/></t-form-item>
        <t-button block theme="primary" type="submit">登录</t-button>
      </t-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'; import { useRouter } from 'vue-router'; import { useAuthStore } from '@/stores/auth'; import { Toast } from 'tdesign-mobile-vue'
const router = useRouter(); const auth = useAuthStore(); const username = ref(''); const password = ref('')
function onSubmit(e:any){ e.preventDefault(); if(!username.value||!password.value){ Toast.error('请输入用户名和密码'); return }
auth.setToken('demo-token'); Toast.success('登录成功'); const target = auth.redirectAfterLogin || '/'; auth.setRedirect(null); router.replace(target) }
</script>
<style scoped>
.page.login{min-height:100dvh;display:grid;place-items:center;padding:24px;}
.card{width:100%;max-width:420px;background:#fff;border-radius:16px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,.06);}
.title{margin-top:0;text-align:center;}
</style>
