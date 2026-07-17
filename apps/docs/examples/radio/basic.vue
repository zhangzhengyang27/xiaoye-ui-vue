<template>
  <xy-radio v-model:checked="checked">Radio</xy-radio>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref<boolean>(false);
</script>
