<template>
  Current break point:
  <template v-for="(value, key) in screens">
    <xy-tag v-if="!!value" :key="key" color="blue">
      {{ key }}
    </xy-tag>
  </template>
</template>
<script lang="ts" setup>
import { Grid } from 'xiaoye-ui';

const useBreakpoint = Grid.useBreakpoint;
const screens = useBreakpoint();
</script>
