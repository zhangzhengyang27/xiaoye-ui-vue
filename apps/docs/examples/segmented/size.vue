<template>
  <a-segmented v-model:value="value" :options="data" size="large" />
  <br />
  <br />
  <a-segmented v-model:value="value2" :options="data" />
  <br />
  <br />
  <a-segmented v-model:value="value3" :options="data" size="small" />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
const data = reactive(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']);
const value = ref(data[0]);
const value2 = ref(data[0]);
const value3 = ref(data[0]);
</script>
