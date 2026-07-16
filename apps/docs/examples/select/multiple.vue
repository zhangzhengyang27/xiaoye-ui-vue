<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select"
    :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};
const value = ref(['a1', 'b2']);
</script>
