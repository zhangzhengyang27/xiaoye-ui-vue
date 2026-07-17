<template>
  <div>
    <xy-input-search v-model:value="value" placeholder="input search loading deault" loading />
    <br />
    <br />
    <xy-input-search
      v-model:value="value"
      placeholder="input search loading with enterButton"
      loading
      enter-button
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
</script>
