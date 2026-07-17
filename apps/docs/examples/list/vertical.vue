<template>
  <xy-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
    <template #footer>
      <div>
        <b>Xiaoye UI</b>
        footer part
      </div>
    </template>
    <template #renderItem="{ item }">
      <xy-list-item key="item.title">
        <template #actions>
          <span v-for="{ icon, text } in actions" :key="icon">
            <component :is="icon" style="margin-right: 8px" />
            {{ text }}
          </span>
        </template>
        <template #extra>
          <img
            width="272"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        </template>
        <xy-list-item-meta :description="item.description">
          <template #title>
            <a :href="item.href">{{ item.title }}</a>
          </template>
          <template #avatar><xy-avatar :src="item.avatar" /></template>
        </xy-list-item-meta>
        {{ item.content }}
      </xy-list-item>
    </template>
  </xy-list>
</template>
<script lang="ts" setup>
import { StarOutlined, LikeOutlined, MessageOutlined } from '@xiaoye-ui/icons';
const listData: Record<string, string>[] = [];

for (let i = 0; i < 23; i++) {
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

const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 3,
};
const actions: Record<string, any>[] = [
  { icon: StarOutlined, text: '156' },
  { icon: LikeOutlined, text: '156' },
  { icon: MessageOutlined, text: '2' },
];
</script>
