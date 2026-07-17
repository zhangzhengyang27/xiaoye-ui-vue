<template>
  <xy-button @click="success">Customized style</xy-button>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const success = () => {
  message.success({
    content: () => 'This is a prompt message with custom className and style',
    class: 'custom-class',
    style: {
      marginTop: '20vh',
    },
  });
};
</script>
<style>
.custom-class {
  color: red;
}
</style>
