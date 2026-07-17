<template>
  <div>
    <xy-radio-group v-model:value="size">
      <xy-radio value="small">Small</xy-radio>
      <xy-radio value="middle">Middle</xy-radio>
      <xy-radio value="large">Large</xy-radio>
    </xy-radio-group>
    <br />
    <br />
    <xy-space :size="size">
      <xy-button type="primary">Primary</xy-button>
      <xy-button>Default</xy-button>
      <xy-button type="dashed">Dashed</xy-button>
      <xy-button type="link">Link</xy-button>
    </xy-space>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const size = ref('small' as const);
</script>
