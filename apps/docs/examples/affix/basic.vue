<template>
  <xy-affix :offset-top="top">
    <xy-button type="primary" @click="top += 10">Affix top</xy-button>
  </xy-affix>
  <br />
  <xy-affix :offset-bottom="bottom">
    <xy-button type="primary" @click="bottom += 10">Affix bottom</xy-button>
  </xy-affix>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const top = ref<number>(10);
const bottom = ref<number>(10);
</script>
