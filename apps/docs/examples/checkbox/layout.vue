<template>
  <a-checkbox-group v-model:value="value" style="width: 100%">
    <a-row>
      <a-col :span="8">
        <a-checkbox value="A">A</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="B">B</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="C">C</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="D">D</a-checkbox>
      </a-col>
      <a-col :span="8">
        <a-checkbox value="E">E</a-checkbox>
      </a-col>
    </a-row>
  </a-checkbox-group>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref([]);
</script>
