<template>
  <div>
    <a-steps
      v-model:current="current"
      :items="[
        {
          title: 'Step 1',
          description,
        },
        {
          title: 'Step 2',
          description,
        },
        {
          title: 'Step 3',
          description,
        },
      ]"
    ></a-steps>
    <a-divider />
    <a-steps
      v-model:current="current"
      direction="vertical"
      :items="[
        {
          title: 'Step 1',
          description,
        },
        {
          title: 'Step 2',
          description,
        },
        {
          title: 'Step 3',
          description,
        },
      ]"
    ></a-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(0);
const description = 'This is a description.';
</script>
