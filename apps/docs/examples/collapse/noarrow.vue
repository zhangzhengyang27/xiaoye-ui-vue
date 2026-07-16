<template>
  <a-collapse v-model:active-key="activeKey">
    <a-collapse-panel key="1" header="This is panel header with arrow icon">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="This is panel header with no arrow icon" :show-arrow="false">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const activeKey = ref(['1']);
const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;

watch(activeKey, val => {
  console.log('activeKey', val);
});
</script>
