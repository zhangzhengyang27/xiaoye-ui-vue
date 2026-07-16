<template>
  <div class="components-input-demo-size">
    <a-input v-model:value="value" size="large" placeholder="large size" />
    <a-input v-model:value="value" placeholder="default size" />
    <a-input v-model:value="value" size="small" placeholder="small size" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
</script>
<style scoped>
.components-input-demo-size .xy-input {
  width: 200px;
  margin: 0 8px 8px 0;
}
</style>
