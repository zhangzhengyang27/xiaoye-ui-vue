<template>
  Current break point:
  <template v-for="(value, key) in screens">
    <a-tag v-if="!!value" :key="key" color="blue">
      {{ key }}
    </a-tag>
  </template>
</template>
<script lang="ts" setup>
import { Grid } from 'xiaoye-ui';

const useBreakpoint = Grid.useBreakpoint;
const screens = useBreakpoint();
</script>
