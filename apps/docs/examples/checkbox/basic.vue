<template>
  <a-checkbox v-model:checked="checked">Checkbox</a-checkbox>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref(false);
</script>
