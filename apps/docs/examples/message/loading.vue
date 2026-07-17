<template>
  <xy-button @click="success">Display a loading indicator</xy-button>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const success = () => {
  const hide = message.loading('Action in progress..', 0);
  setTimeout(hide, 2500);
};
</script>
