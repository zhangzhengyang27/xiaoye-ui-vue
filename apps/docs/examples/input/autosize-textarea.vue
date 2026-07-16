<template>
  <div>
    <a-textarea
      v-model:value="value1"
      placeholder="Autosize height based on content lines"
      auto-size
    />
    <div style="margin: 24px 0" />
    <a-textarea
      v-model:value="value2"
      placeholder="Autosize height with minimum and maximum number of lines"
      :auto-size="{ minRows: 2, maxRows: 5 }"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<string>('');
const value2 = ref<string>('');
</script>
