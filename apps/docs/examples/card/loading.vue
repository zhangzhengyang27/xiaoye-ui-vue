<template>
  <xy-card :loading="loading" title="Card title">whatever content</xy-card>
  <xy-button style="margin-top: 16px" @click="handleClick">Toggle loading</xy-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const loading = ref(true);

const handleClick = () => {
  loading.value = !loading.value;
};
</script>
