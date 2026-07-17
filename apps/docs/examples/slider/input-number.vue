<template>
  <div>
    <xy-row>
      <xy-col :span="12">
        <xy-slider v-model:value="inputValue1" :min="1" :max="20" />
      </xy-col>
      <xy-col :span="4">
        <xy-input-number v-model:value="inputValue1" :min="1" :max="20" style="margin-left: 16px" />
      </xy-col>
    </xy-row>
    <xy-row>
      <xy-col :span="12">
        <xy-slider v-model:value="inputValue" :min="0" :max="1" :step="0.01" />
      </xy-col>
      <xy-col :span="4">
        <xy-input-number
          v-model:value="inputValue"
          :min="0"
          :max="1"
          :step="0.01"
          style="margin-left: 16px"
        />
      </xy-col>
    </xy-row>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const inputValue = ref<number>(0);
const inputValue1 = ref<number>(1);
</script>
<style scoped>
.code-box-demo .xy-slider {
  margin-bottom: 16px;
}
</style>
