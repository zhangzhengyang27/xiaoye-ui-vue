<template>
  <xy-space>
    <xy-cascader
      v-model:value="value1"
      style="margin-top: 1rem"
      :options="options"
      placeholder="Please select"
    >
      <template #suffixIcon><smile-outlined class="test" /></template>
    </xy-cascader>
    <xy-cascader
      v-model:value="value2"
      suffix-icon="ab"
      style="margin-top: 1rem"
      :options="options"
      placeholder="Please select"
    />
  </xy-space>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@xiaoye-ui/icons';
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
          },
        ],
      },
    ],
  },
];
const value1 = ref<string[]>([]);
const value2 = ref<string[]>([]);
</script>
