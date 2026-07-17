<template>
  <xy-list item-layout="horizontal" :data-source="data">
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
      </xy-list-item>
    </template>
  </xy-list>
</template>
<script lang="ts" setup>
interface DataItem {
  title: string;
}
const data: DataItem[] = [
  {
    title: 'Xiaoye UI Title 1',
  },
  {
    title: 'Xiaoye UI Title 2',
  },
  {
    title: 'Xiaoye UI Title 3',
  },
  {
    title: 'Xiaoye UI Title 4',
  },
];
</script>
