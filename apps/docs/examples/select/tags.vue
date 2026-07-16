<template>
  <a-select
    v-model:value="value"
    mode="tags"
    style="width: 100%"
    placeholder="Tags Mode"
    :options="options"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const value = ref([]);
const options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
</script>
