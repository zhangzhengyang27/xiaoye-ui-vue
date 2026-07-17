<template>
  <xy-list :data-source="data">
    <template #renderItem="{ item }">
      <xy-list-item>
        <xy-list-item-meta
          description="Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team"
        >
          <template #title>
            <a href="https://www.xiaoye-ui.github.io/">{{ item.title }}</a>
          </template>
          <template #avatar>
            <xy-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </xy-list-item-meta>
        <xy-steps
          style="margin-top: 8px"
          type="inline"
          :current="item.current"
          :status="item.status"
          :items="items"
        />
      </xy-list-item>
    </template>
  </xy-list>
</template>
<script lang="ts" setup>
const data = [
  {
    title: 'Xiaoye UI Title 1',
    current: 0,
  },
  {
    title: 'Xiaoye UI Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Xiaoye UI Title 3',
    current: 2,
  },
  {
    title: 'Xiaoye UI Title 4',
    current: 1,
  },
];

const items = [
  {
    title: 'Step 1',
    description: 'This is a Step 1.',
  },
  {
    title: 'Step 2',
    description: 'This is a Step 2.',
  },
  {
    title: 'Step 3',
    description: 'This is a Step 3.',
  },
];
</script>
