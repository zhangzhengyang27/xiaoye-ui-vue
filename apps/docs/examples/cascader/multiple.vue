<template>
  <xy-space direction="vertical" style="width: 100%">
    <h4>Cascader.SHOW_PARENT</h4>
    <xy-cascader
      v-model:value="value"
      style="width: 100%"
      multiple
      max-tag-count="responsive"
      :options="options"
      placeholder="Please select"
    ></xy-cascader>
    <h4>Cascader.SHOW_CHILD</h4>
    <xy-cascader
      v-model:value="value"
      style="width: 100%"
      multiple
      max-tag-count="responsive"
      :options="options"
      placeholder="Please select"
      :show-checked-strategy="Cascader.SHOW_CHILD"
    ></xy-cascader>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from 'xiaoye-ui';
import { Cascader } from 'xiaoye-ui';
const options: CascaderProps['options'] = [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

const value = ref<string[]>([]);
</script>
