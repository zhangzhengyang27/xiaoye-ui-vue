<template>
  <div>
    <xy-switch :checked="!loading" @change="onChange" />
    <xy-list item-layout="vertical" size="large" :data-source="listData">
      <template #renderItem="{ item }">
        <xy-list-item key="item.title">
          <template v-if="!loading" #actions>
            <span v-for="({ icon, text }, index) in actions" :key="index">
              <component :is="icon" style="margin-right: 8px"></component>
              {{ text }}
            </span>
          </template>
          <template #extra>
            <img
              v-if="!loading"
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          </template>
          <xy-skeleton :loading="loading" active avatar>
            <xy-list-item-meta :description="item.description">
              <template #title>
                <a :href="item.href">{{ item.title }}</a>
              </template>
              <template #avatar><xy-avatar :src="item.avatar" /></template>
            </xy-list-item-meta>
            {{ item.content }}
          </xy-skeleton>
        </xy-list-item>
      </template>
    </xy-list>
  </div>
</template>
<script lang="ts" setup>
import { StarOutlined, LikeOutlined, MessageOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
interface DataItem {
  href: string;
  title: string;
  avatar: string;
  description: string;
  content: string;
}
const listData: DataItem[] = [];
for (let i = 0; i < 3; i++) {
  listData.push({
    href: 'https://www.xiaoye-ui.github.io/',
    title: `Xiaoye UI part ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description:
      'Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

const loading = ref<boolean>(true);

const actions = [
  { icon: StarOutlined, text: '156' },
  { icon: LikeOutlined, text: '156' },
  { icon: MessageOutlined, text: '2' },
];

const onChange = (checked: boolean) => {
  loading.value = !checked;
};
</script>
<style scoped>
.skeleton-demo {
  border: 1px solid #f4f4f4;
}
</style>
