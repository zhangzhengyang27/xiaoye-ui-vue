<template>
  <div>
    <a-input-number id="inputNumber" v-model:value="value" :bordered="false" :min="1" :max="10" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(3);
</script>
