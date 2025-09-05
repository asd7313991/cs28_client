<template>
  <div class="banner">
    <t-swiper :autoplay="3000" :loop="true" :navigation="{ placement: 'inside' }">
      <t-swiper-item v-for="(b, i) in items" :key="i">
        <a :href="b.link || 'javascript:void(0)'" class="banner-item" :aria-label="b.alt || ('banner-' + i)">
          <img :src="b.img" :alt="b.alt || ''" loading="lazy" />
        </a>
      </t-swiper-item>
    </t-swiper>
  </div>
</template>

<script setup lang="ts">
type Banner = { img: string; link?: string; alt?: string }
defineProps<{ items: Banner[] }>()
</script>

<style scoped>
/* 外层卡片化：圆角 + 阴影，确保不会“贴边” */
.banner { padding: 10px 12px 0; }

/* 让整个轮播容器有固定可计算的高度（用 aspect-ratio 保证统一比例） */
:deep(.t-swiper) { border-radius: 12px; overflow: hidden; }
.banner-item { display: block; width: 100%; aspect-ratio: 375 / 160; }

/* 核心：统一图片铺放，避免尺寸不一导致的错乱 */
.banner-item img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;      /* 关键：按容器裁剪，避免拉伸/错位 */
}

/* 如果你的浏览器目标不支持 aspect-ratio，可解开下面“老式占位”写法：
.banner-item { position: relative; width: 100%; }
.banner-item::before { content: ""; display: block; padding-top: calc(160 / 375 * 100%); }
.banner-item img { position: absolute; inset: 0; }
*/
</style>
