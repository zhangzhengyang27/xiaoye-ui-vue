<template>
  <div>
    <a-progress :percent="defaultPercent" />
    <a-button-group>
      <a-button @click="decline">
        <template #icon><minus-outlined /></template>
      </a-button>
      <a-button @click="increase">
        <template #icon><plus-outlined /></template>
      </a-button>
    </a-button-group>
  </div>
</template>
<script lang="ts" setup>
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
const defaultPercent = ref<number>(0);

const increase = () => {
  const percent = defaultPercent.value + 10;
  defaultPercent.value = percent > 100 ? 100 : percent;
};

const decline = () => {
  const percent = defaultPercent.value - 10;
  defaultPercent.value = percent < 0 ? 0 : percent;
};
</script>
