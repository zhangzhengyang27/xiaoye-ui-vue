<template>
  <xy-checkbox-group v-model:value="value" style="width: 100%">
    <xy-row>
      <xy-col :span="8">
        <xy-checkbox value="A">A</xy-checkbox>
      </xy-col>
      <xy-col :span="8">
        <xy-checkbox value="B">B</xy-checkbox>
      </xy-col>
      <xy-col :span="8">
        <xy-checkbox value="C">C</xy-checkbox>
      </xy-col>
      <xy-col :span="8">
        <xy-checkbox value="D">D</xy-checkbox>
      </xy-col>
      <xy-col :span="8">
        <xy-checkbox value="E">E</xy-checkbox>
      </xy-col>
    </xy-row>
  </xy-checkbox-group>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref([]);
</script>
