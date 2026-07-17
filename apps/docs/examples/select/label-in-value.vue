<template>
  <xy-select
    v-model:value="value"
    label-in-value
    style="width: 120px"
    :options="options"
    @change="handleChange"
  ></xy-select>
</template>
<script lang="ts" setup>
import type { SelectProps } from 'xiaoye-ui';
import { ref } from 'vue';
const options = ref<SelectProps['options']>([
  {
    value: 'jack',
    label: 'Jack (100)',
  },
  {
    value: 'lucy',
    label: 'Lucy (101)',
  },
]);
const handleChange: SelectProps['onChange'] = value => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};

const value = ref({ value: 'lucy', label: 'Lucy (101)' });
</script>
