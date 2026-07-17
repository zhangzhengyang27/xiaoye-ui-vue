<template>
  <div>
    <xy-progress type="circle" :percent="defaultPercent" />
    <xy-button-group>
      <xy-button @click="decline">
        <template #icon><minus-outlined /></template>
      </xy-button>
      <xy-button @click="increase">
        <template #icon><plus-outlined /></template>
      </xy-button>
    </xy-button-group>
  </div>
</template>
<script lang="ts" setup>
import { MinusOutlined, PlusOutlined } from '@xiaoye-ui/icons';
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
