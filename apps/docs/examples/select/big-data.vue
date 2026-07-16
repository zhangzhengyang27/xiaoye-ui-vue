<template>
  <h2>{{ options.length }} Items</h2>
  <a-select
    v-model:value="value"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select"
    :options="options"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const options: { value: string; disabled: boolean }[] = [];
for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push({
    value,
    disabled: i === 10,
  });
}

const value = ref(['a10', 'c12']);
</script>
