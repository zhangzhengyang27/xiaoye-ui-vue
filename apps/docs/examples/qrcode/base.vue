<template>
  <a-space direction="vertical" align="center">
    <a-qrcode :value="text" />
    <a-input v-model:value="text" placeholder="-" :maxlength="60" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const text = ref('https://www.xiaoye-ui.github.io/');
</script>
