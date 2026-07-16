<template>
  <a-card :loading="loading" title="Card title">whatever content</a-card>
  <a-button style="margin-top: 16px" @click="handleClick">Toggle loading</a-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const loading = ref(true);

const handleClick = () => {
  loading.value = !loading.value;
};
</script>
