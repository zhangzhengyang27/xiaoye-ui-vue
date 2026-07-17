<template>
  <xy-galleria
    :value="images"
    :active-index="activeIndex"
    show-item-navigators
    @update:active-index="activeIndex = $event"
  >
    <template #item="{ item }">
      <img :src="item.src" :alt="item.title" class="main-image" />
    </template>
    <template #thumbnail="{ item }">
      <img :src="item.thumbnail" :alt="item.title" class="thumb-image" />
    </template>
    <template #caption="{ item }">
      <div class="caption">
        <div class="title">{{ item.title }}</div>
        <div class="desc">{{ item.desc }}</div>
      </div>
    </template>
  </xy-galleria>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface ImageItem {
  title: string;
  desc: string;
  src: string;
  thumbnail: string;
}

const activeIndex = ref(0);

const images: ImageItem[] = [
  {
    title: '长城',
    desc: '万里长城，雄关漫道。',
    src: 'https://picsum.photos/seed/c1/640/360',
    thumbnail: 'https://picsum.photos/seed/c1/120/68',
  },
  {
    title: '故宫',
    desc: '紫禁城，六百年皇家宫苑。',
    src: 'https://picsum.photos/seed/c2/640/360',
    thumbnail: 'https://picsum.photos/seed/c2/120/68',
  },
  {
    title: '西湖',
    desc: '欲把西湖比西子，淡妆浓抹总相宜。',
    src: 'https://picsum.photos/seed/c3/640/360',
    thumbnail: 'https://picsum.photos/seed/c3/120/68',
  },
  {
    title: '黄山',
    desc: '五岳归来不看山，黄山归来不看岳。',
    src: 'https://picsum.photos/seed/c4/640/360',
    thumbnail: 'https://picsum.photos/seed/c4/120/68',
  },
];
</script>

<style scoped>
.main-image {
  width: 100%;
  display: block;
  border-radius: 4px;
}
.thumb-image {
  width: 100%;
  display: block;
}
.caption {
  padding: 12px 16px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
}
.title {
  font-size: 16px;
  font-weight: 600;
}
.desc {
  margin-top: 4px;
  font-size: 13px;
  opacity: 0.85;
}
</style>
