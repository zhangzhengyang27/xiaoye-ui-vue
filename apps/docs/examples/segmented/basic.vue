<template>
  <a-segmented v-model:value="value" :options="data" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const data = reactive(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']);
const value = ref(data[0]);
</script>
