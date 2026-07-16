<template>
  <a-space>
    <a-select
      v-model:value="value1"
      style="width: 120px"
      :options="options1"
      @change="handleChange"
    >
      <template #suffixIcon><smile-outlined class="xy-select-suffix" /></template>
    </a-select>
    <a-select v-model:value="value2" style="width: 120px" disabled :options="options2">
      <template #suffixIcon><meh-outlined class="xy-select-suffix" /></template>
    </a-select>
  </a-space>
</template>
<script lang="ts" setup>
import { SmileOutlined, MehOutlined } from '@ant-design/icons-vue';
import type { SelectProps } from 'xiaoye-ui';
import { ref } from 'vue';

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const options1 = ref<SelectProps['options']>([
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'disabled',
    label: 'Disabled',
    disabled: true,
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe',
  },
]);
const options2 = ref<SelectProps['options']>([
  {
    value: 'lucy',
    label: 'Lucy',
  },
]);
const value1 = ref('lucy');
const value2 = ref('lucy');
</script>
