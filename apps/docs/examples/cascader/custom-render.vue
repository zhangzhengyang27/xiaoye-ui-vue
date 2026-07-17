<template>
  <xy-cascader
    v-model:value="value"
    placeholder="Please select"
    :options="options"
    style="width: 100%"
  >
    <template #displayRender="{ labels, selectedOptions }">
      <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
        <span v-if="index === labels.length - 1">
          {{ label }} (
          <a @click="e => handleAreaClick(e, label, selectedOptions[index])">
            {{ selectedOptions[index].code }}
          </a>
          )
        </span>
        <span v-else>{{ label }} /</span>
      </span>
    </template>
  </xy-cascader>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from 'xiaoye-ui';
const options: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            code: 752100,
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            code: 453400,
          },
        ],
      },
    ],
  },
];

const handleAreaClick = (e: Event, label: string, option: CascaderProps['options'][number]) => {
  e.stopPropagation();
  console.log('clicked', label, option);
};

const value = ref<string[]>(['zhejiang', 'hangzhou', 'xihu']);
</script>
