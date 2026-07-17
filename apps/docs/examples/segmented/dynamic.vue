<template>
  <xy-segmented v-model:value="value" :options="data"></xy-segmented>
  <br />
  <br />
  <xy-button type="primary" :disabled="isDisabled" @click="loadMore">Load More</xy-button>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const data = reactive(['Daily', 'Weekly', 'Monthly']);
const isDisabled = ref(false);
const loadMore = () => {
  data.push(...['Quarterly', 'Yearly']);
  isDisabled.value = true;
};
const value = ref(data[0]);
</script>
