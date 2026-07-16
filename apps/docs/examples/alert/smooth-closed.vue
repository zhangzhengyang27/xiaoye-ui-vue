<template>
  <a-alert
    v-if="visible"
    message="Alert Message Text"
    type="success"
    closable
    :after-close="handleClose"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref<boolean>(true);
const handleClose = () => {
  visible.value = false;
};
</script>
