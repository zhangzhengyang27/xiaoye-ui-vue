<template>
  <div>
    <xy-radio-group v-model:value="mode" :style="{ marginBottom: '8px' }">
      <xy-radio-button value="top">Horizontal</xy-radio-button>
      <xy-radio-button value="left">Vertical</xy-radio-button>
    </xy-radio-group>
    <xy-tabs v-model:active-key="activeKey" :tab-position="mode" :style="{ height: '200px' }">
      <xy-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`">Content of tab {{ i }}</xy-tab-pane>
    </xy-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const mode = ref<'top' | 'left'>('top');
const activeKey = ref(1);
</script>
