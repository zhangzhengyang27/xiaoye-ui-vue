<template>
  <xy-space direction="vertical" align="center">
    <xy-qrcode :value="text" />
    <xy-input v-model:value="text" placeholder="-" :maxlength="60" />
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const text = ref('https://www.xiaoye-ui.github.io/');
</script>
