<template>
  <div>
    <xy-steps
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
    ></xy-steps>
    <xy-divider />
    <xy-steps
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
    ></xy-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(0);
const description = 'This is a description.';
</script>
