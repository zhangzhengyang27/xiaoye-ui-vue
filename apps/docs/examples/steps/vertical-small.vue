<template>
  <xy-steps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Finished', description },
      {
        title: 'In Progress',
        description,
      },
      {
        title: 'Waiting',
        description,
      },
    ]"
  ></xy-steps>
</template>
<script lang="ts" setup>
const description = 'This is a description.';
</script>
