<template>
  <a-switch v-model:checked="ellipsis" />
  <a-typography-paragraph
    :ellipsis="ellipsis"
    content=" Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team."
  />

  <a-typography-paragraph
    :ellipsis="ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false"
    content="Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team. Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team."
  />

  <a-typography-text
    :style="ellipsis ? { width: '100px' } : {}"
    :ellipsis="ellipsis ? { tooltip: 'I am ellipsis now!' } : false"
    content="Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team."
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const ellipsis = ref(true);
</script>
