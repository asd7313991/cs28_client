<template><t-popup :visible="modelValue" placement="bottom" @close="onClose"><div class="drawer"><slot/></div></t-popup></template>
<script setup lang="ts">const emit = defineEmits<{(e:'update:modelValue',v:boolean):void}>(); defineProps<{modelValue:boolean}>(); function onClose(){emit('update:modelValue',false)}</script>
<style scoped>.drawer{padding:12px;}</style>
