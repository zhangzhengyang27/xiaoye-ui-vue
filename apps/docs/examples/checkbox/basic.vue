<template>
  <xy-checkbox v-model:checked="checked">Checkbox</xy-checkbox>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref(false);
</script>
