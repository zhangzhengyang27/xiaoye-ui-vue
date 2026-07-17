<template>
  <span>
    {{ text }} &nbsp;
    <xy-cascader
      v-model:value="value"
      placeholder="Please select"
      :options="options"
      @change="onChange"
    >
      <a href="#">Change city</a>
    </xy-cascader>
  </span>
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
const value = ref<string[]>([]);
const text = ref<string>('Unselect');

const onChange: CascaderProps['onChange'] = (_value, selectedOptions) => {
  text.value = selectedOptions.map(o => o.label).join(', ');
};
</script>
