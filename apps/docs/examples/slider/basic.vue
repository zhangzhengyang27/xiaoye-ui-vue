<template>
  <div>
    <xy-slider id="test" v-model:value="value1" :disabled="disabled" />
    <xy-slider v-model:value="value2" range :disabled="disabled" />
    Disabled:
    <xy-switch v-model:checked="disabled" size="small" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(0);
const value2 = ref<[number, number]>([20, 50]);
const disabled = ref<boolean>(false);
</script>
<style scoped>
.code-box-demo .xy-slider {
  margin-bottom: 16px;
}
</style>
