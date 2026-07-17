<template>
  <xy-steps
    :current="1"
    :items="[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
        description,
        subTitle: 'Left 00:00:08',
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
