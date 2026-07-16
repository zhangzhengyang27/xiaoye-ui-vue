<template>
  <a-pagination v-model:current="current" simple :total="50" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(2);
</script>
