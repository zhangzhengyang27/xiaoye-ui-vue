<template>
  <div class="code-box-demo">
    <a-slider v-model:value="value1" @change="onChange" @afterChange="onAfterChange" />
    <a-slider
      v-model:value="value2"
      range
      :step="10"
      @change="onChange"
      @afterChange="onAfterChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<number>(30);
const value2 = ref<[number, number]>([20, 50]);

const onChange = (value: number) => {
  console.log('onChange: ', value);
};

const onAfterChange = (value: number) => {
  console.log('afterChange: ', value);
};
</script>
<style scoped>
.code-box-demo .xy-slider {
  margin-bottom: 16px;
}
</style>
