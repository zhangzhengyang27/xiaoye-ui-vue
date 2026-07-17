<template>
  <xy-space direction="vertical">
    <xy-radio-group v-model:value="value1" :options="plainOptions" />
    <xy-radio-group v-model:value="value2" :options="optionsWithDisabled" />
    <xy-radio-group v-model:value="value3" :options="plainOptions" disabled />
    <xy-radio-group v-model:value="value1" option-type="button" :options="plainOptions" />
    <xy-radio-group v-model:value="value2" option-type="button" :options="optionsWithDisabled" />
    <xy-radio-group v-model:value="value3" option-type="button" :options="plainOptions" disabled />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { RadioGroupProps } from 'xiaoye-ui';
const plainOptions = ['Apple', 'Pear', 'Orange'];
const optionsWithDisabled: RadioGroupProps['options'] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: true },
];
const value1 = ref<string>('Apple');
const value2 = ref<string>('Apple');
const value3 = ref<string>('Apple');
</script>
