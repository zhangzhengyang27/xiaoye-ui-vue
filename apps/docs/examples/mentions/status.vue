<template>
  <xy-space direction="vertical">
    <xy-mentions
      v-model:value="value"
      :options="options"
      autofocus
      status="error"
      @select="onSelect"
    ></xy-mentions>
    <xy-mentions
      v-model:value="value"
      :options="options"
      autofocus
      status="warning"
      @select="onSelect"
    ></xy-mentions>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const value = ref<string>('@afc163');
watch(value, () => {
  console.log('value', value);
});
const onSelect = (option: { value: string }) => {
  console.log('select', option);
};

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
