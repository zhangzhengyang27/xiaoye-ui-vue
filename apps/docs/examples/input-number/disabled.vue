<template>
  <div>
    <xy-input-number v-model:value="value" :min="1" :max="10" :disabled="disabled" />
    <div style="margin-top: 20px">
      <xy-button type="primary" @click="toggle">Toggle disabled</xy-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
const disabled = ref<boolean>(true);

const toggle = () => {
  disabled.value = !disabled.value;
};
</script>
