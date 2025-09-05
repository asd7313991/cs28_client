<template><div class="app-root"><router-view /></div></template>
<script setup lang="ts"></script>
<style scoped>

.app-root{min-height:100dvh;background:var(--td-bg-color-page,#f7f8fa);}

html, body, #app { height: 100%; }
body { margin: 0; overscroll-behavior-y: none; } /* 阻断到顶下拉传到窗口（安卓 Chrome 有用） */


</style>
