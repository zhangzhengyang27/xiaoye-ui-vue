<template>
  <xy-space direction="vertical" :size="12">
    <xy-date-picker v-model:value="value1">
      <template #dateRender="{ current }">
        <div class="xy-picker-cell-inner" :style="getCurrentStyle(current)">
          {{ current.date() }}
        </div>
      </template>
    </xy-date-picker>
    <xy-range-picker v-model:value="value2">
      <template #dateRender="{ current }">
        <div class="xy-picker-cell-inner" :style="getCurrentStyle(current)">
          {{ current.date() }}
        </div>
      </template>
    </xy-range-picker>
  </xy-space>
</template>
<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import { ref } from 'vue';
import type { CSSProperties } from 'vue';
const getCurrentStyle = (current: Dayjs) => {
  const style: CSSProperties = {};

  if (current.date() === 1) {
    style.border = '1px solid #1890ff';
    style.borderRadius = '50%';
  }

  return style;
};
const value1 = ref<Dayjs>();
const value2 = ref<[Dayjs, Dayjs]>();
</script>
