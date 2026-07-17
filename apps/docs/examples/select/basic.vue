<template>
  <h2>use a-select-option</h2>
  <xy-space>
    <xy-select
      ref="select"
      v-model:value="value1"
      style="width: 120px"
      @focus="focus"
      @change="handleChange"
    >
      <xy-select-option value="jack">Jack</xy-select-option>
      <xy-select-option value="lucy">Lucy</xy-select-option>
      <xy-select-option value="disabled" disabled>Disabled</xy-select-option>
      <xy-select-option value="Yiminghe">yiminghe</xy-select-option>
    </xy-select>
    <xy-select v-model:value="value2" style="width: 120px" disabled>
      <xy-select-option value="lucy">Lucy</xy-select-option>
    </xy-select>
    <xy-select v-model:value="value3" style="width: 120px" loading>
      <xy-select-option value="lucy">Lucy</xy-select-option>
    </xy-select>
  </xy-space>
  <h2 style="margin-top: 10px">use options (recommend)</h2>
  <xy-space>
    <xy-select
      ref="select"
      v-model:value="value1"
      style="width: 120px"
      :options="options1"
      @focus="focus"
      @change="handleChange"
    ></xy-select>
    <xy-select v-model:value="value2" style="width: 120px" disabled :options="options2"></xy-select>
    <xy-select v-model:value="value3" style="width: 120px" loading :options="options3"></xy-select>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectProps } from 'xiaoye-ui';
const value1 = ref('lucy');
const value2 = ref('lucy');
const value3 = ref('lucy');
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
const options3 = ref<SelectProps['options']>([
  {
    value: 'lucy',
    label: 'Lucy',
  },
]);
const focus = () => {
  console.log('focus');
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
</script>
