<template>
  <xy-cascader
    v-model:value="value"
    :field-names="{ label: 'name', value: 'code', children: 'items' }"
    :options="options"
    placeholder="Please select"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from 'xiaoye-ui';
const options: CascaderProps['options'] = [
  {
    code: 'zhejiang',
    name: 'Zhejiang',
    items: [
      {
        code: 'hangzhou',
        name: 'Hangzhou',
        items: [
          {
            code: 'xihu',
            name: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    code: 'jiangsu',
    name: 'Jiangsu',
    items: [
      {
        code: 'nanjing',
        name: 'Nanjing',
        items: [
          {
            code: 'zhonghuamen',
            name: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const value = ref<string[]>([]);
</script>
