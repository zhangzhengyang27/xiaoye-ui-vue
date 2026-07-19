<template>
  <xy-chips v-model:value="tags" disabled />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

// 禁用状态：不可添加或删除标签。
const tags = ref<string[]>(['Vue', 'React', 'Angular']);
</script>
