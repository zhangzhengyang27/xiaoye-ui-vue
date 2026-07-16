<template>
  <a-button ref="btnRef" type="primary" @click="handleOpen(true)">Begin Tour</a-button>

  <a-tour :open="open" :steps="steps" @close="handleOpen(false)" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TourProps } from 'xiaoye-ui';

const open = ref<boolean>(false);

const btnRef = ref(null);

const steps: TourProps['steps'] = [
  {
    title: 'Center',
    description: 'Displayed in the center of screen.',
    target: null,
  },
  {
    title: 'Right',
    description: 'On the right of target.',
    placement: 'right',
    target: () => btnRef.value && btnRef.value.$el,
  },
  {
    title: 'Top',
    description: 'On the top of target.',
    placement: 'top',
    target: () => btnRef.value && btnRef.value.$el,
  },
];

const handleOpen = (val: boolean): void => {
  open.value = val;
};
</script>
