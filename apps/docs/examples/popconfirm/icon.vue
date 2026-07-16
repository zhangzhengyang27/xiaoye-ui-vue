<template>
  <a-popconfirm title="Are you sure？">
    <template #icon><question-circle-outlined style="color: red" /></template>
    <a href="#">Delete</a>
  </a-popconfirm>
</template>
<script lang="ts" setup>
import { QuestionCircleOutlined } from '@xiaoye-ui/icons';
</script>
