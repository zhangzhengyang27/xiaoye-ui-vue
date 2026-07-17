<template>
  <xy-popover v-model:open="visible" title="Title" trigger="click">
    <template #content>
      <a @click="hide">Close</a>
    </template>
    <xy-button type="primary">Click me</xy-button>
  </xy-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref<boolean>(false);

const hide = () => {
  visible.value = false;
};
</script>
