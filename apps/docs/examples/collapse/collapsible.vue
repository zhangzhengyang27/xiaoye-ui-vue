<template>
  <xy-space direction="vertical">
    <xy-collapse v-model:active-key="activeKey" collapsible="header">
      <xy-collapse-panel key="1" header="This panel can only be collapsed by clicking text">
        <p>{{ text }}</p>
      </xy-collapse-panel>
    </xy-collapse>
    <xy-collapse v-model:active-key="activeKey" collapsible="icon">
      <xy-collapse-panel key="1" header="This panel can only be collapsed by clicking icon">
        <p>{{ text }}</p>
      </xy-collapse-panel>
    </xy-collapse>
    <xy-collapse collapsible="disabled">
      <xy-collapse-panel key="1" header="This panel can't be collapsed">
        <p>{{ text }}</p>
      </xy-collapse-panel>
    </xy-collapse>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref(['1']);
const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;
</script>
<style scoped>
.xy-space {
  width: 100%;
}
</style>
