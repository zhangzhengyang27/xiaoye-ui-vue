<template>
  <xy-button type="primary" @click="openMessage">Open the message box (update by key)</xy-button>
  <br />
  <br />
  <xy-button type="primary" @click="openMessage2">
    Open the message box (update by reactive)
  </xy-button>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
import { ref } from 'vue';
const key = 'updatable';
const openMessage = () => {
  message.loading({ content: 'Loading...', key });
  setTimeout(() => {
    message.success({ content: 'Loaded!', key, duration: 2 });
  }, 1000);
};
const content = ref('Loading...');
const openMessage2 = () => {
  // content must use function
  message.loading({ content: () => content.value });
  setTimeout(() => {
    content.value = 'Loaded!';
  }, 1000);
};
</script>
