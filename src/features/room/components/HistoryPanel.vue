<template><transition name="curtain"><div v-if="modelValue" class="curtain-panel"><slot/></div></transition></template>
<script setup lang="ts">defineProps<{ modelValue: boolean }>()</script>
<style scoped>
.curtain-panel{position:fixed;top:0;left:0;right:0;background:#fff;border-bottom-left-radius:16px;border-bottom-right-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,0.12);padding:12px 12px 16px;z-index:1000;}
.curtain-enter-from,.curtain-leave-to{transform:translateY(-100%);opacity:0;}
.curtain-enter-active,.curtain-leave-active{transition:all .25s ease;}
</style>
