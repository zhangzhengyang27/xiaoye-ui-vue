<template>
  <xy-flex gap="middle" vertical>
    <xy-radio-group v-model:value="value">
      <xy-radio value="horizontal">horizontal</xy-radio>
      <xy-radio value="vertical">vertical</xy-radio>
    </xy-radio-group>
    <xy-flex :vertical="value === 'vertical'">
      <div
        v-for="(item, index) in new Array(4)"
        :key="item"
        :style="{ ...baseStyle, background: `${index % 2 ? '#1677ff' : '#1677ffbf'}` }"
      />
    </xy-flex>
  </xy-flex>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CSSProperties } from 'vue';
const value = ref('horizontal');
const baseStyle: CSSProperties = {
  width: '25%',
  height: '54px',
};
</script>
