<template>
  <a-select
    v-model:value="value"
    mode="tags"
    style="width: 100%"
    :token-separators="[',']"
    placeholder="Automatic tokenization"
    :options="options"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { SelectProps } from 'xiaoye-ui';
const options = ref<SelectProps['options']>([
  {
    value: 'a1',
    label: 'a1',
  },
]);
const value = ref<string[]>([]);
const handleChange = (value: []) => {
  console.log(`selected ${value}`);
};
watch(value, () => {
  console.log('value', value.value);
});
</script>
