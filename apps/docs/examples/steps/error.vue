<template>
  <a-steps
    v-model:current="current"
    status="error"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Process',
        description,
      },
      {
        title: 'Waiting',
        description,
      },
    ]"
  ></a-steps>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(1);
const description = 'This is a description.';
</script>
