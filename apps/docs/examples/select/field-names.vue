<template>
  <xy-select
    ref="select"
    v-model:value="value"
    style="width: 120px"
    :options="options"
    :field-names="{ label: 'name', value: 'id', options: 'children' }"
    @focus="focus"
    @change="handleChange"
  ></xy-select>
</template>
<script lang="ts" setup>
import type { SelectProps } from 'xiaoye-ui';
import { ref } from 'vue';
const value = ref('lucy');
const options = ref<SelectProps['options']>([
  {
    id: 'jack',
    name: 'Jack',
    children: [
      {
        id: 'small jack',
        name: 'samll Jack',
      },
    ],
  },
  {
    id: 'lucy',
    name: 'Lucy',
  },
  {
    id: 'disabled',
    name: 'Disabled',
    disabled: true,
  },
  {
    id: 'yiminghe',
    name: 'Yiminghe',
  },
]);

const focus = () => {
  console.log('focus');
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
</script>
