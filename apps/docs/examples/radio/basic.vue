<template>
  <a-radio v-model:checked="checked">Radio</a-radio>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref<boolean>(false);
</script>
