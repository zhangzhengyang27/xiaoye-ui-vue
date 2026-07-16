<template>
  <span>
    <a-rate v-model:value="value" :tooltips="desc" />
    <span class="ant-rate-text">{{ desc[value - 1] }}</span>
  </span>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
const desc = ref<string[]>(['terrible', 'bad', 'normal', 'good', 'wonderful']);
</script>
