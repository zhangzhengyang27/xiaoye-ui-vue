<template>
  <xy-collapse v-model:active-key="activeKey" @change="changeActivekey">
    <xy-collapse-panel key="1" header="This is panel header 1">
      <xy-collapse default-active-key="4">
        <xy-collapse-panel key="4" header="This is panel nest panel">
          <p>{{ text }}</p>
        </xy-collapse-panel>
      </xy-collapse>
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

const activeKey = ref([]);
const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;

const changeActivekey = (key: string) => {
  console.log(key);
};
</script>
