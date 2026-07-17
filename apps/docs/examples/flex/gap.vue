<template>
  <xy-flex gap="middle" vertical>
    <xy-radio-group v-model:value="gapSize">
      <xy-radio value="small">small</xy-radio>
      <xy-radio value="middle">middle</xy-radio>
      <xy-radio value="large">large</xy-radio>
      <xy-radio value="customize">customize</xy-radio>
    </xy-radio-group>
    <template v-if="gapSize === 'customize'">
      <xy-slider v-model:value="customGapSize" />
    </template>
    <xy-flex :gap="gapSize !== 'customize' ? gapSize : customGapSize">
      <xy-button type="primary">Primary</xy-button>
      <xy-button>Default</xy-button>
      <xy-button type="dashed">Dashed</xy-button>
      <xy-button type="link">Link</xy-button>
    </xy-flex>
  </xy-flex>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type SizeType = 'small' | 'middle' | 'large' | undefined;

const gapSize = ref<SizeType | 'customize'>('small');

const customGapSize = ref<number>(0);
</script>
