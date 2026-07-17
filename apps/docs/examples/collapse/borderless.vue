<template>
  <xy-collapse v-model:active-key="activeKey" :bordered="false">
    <xy-collapse-panel key="1" header="This is panel header 1">
      <p>{{ text }}</p>
    </xy-collapse-panel>
    <xy-collapse-panel key="2" header="This is panel header 2">
      <p>{{ text }}</p>
    </xy-collapse-panel>
    <xy-collapse-panel key="3" header="This is panel header 3">
      <p>{{ text }}</p>
    </xy-collapse-panel>
  </xy-collapse>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref(['1']);
const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;
</script>
