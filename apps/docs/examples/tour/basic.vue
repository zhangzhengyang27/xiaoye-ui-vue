<template>
  <xy-button type="primary" @click="handleOpen(true)">Begin Tour</xy-button>

  <xy-divider />

  <xy-space>
    <xy-button ref="ref1">Upload</xy-button>
    <xy-button ref="ref2" type="primary">Save</xy-button>
    <xy-button ref="ref3"><EllipsisOutlined /></xy-button>
  </xy-space>

  <xy-tour v-model:current="current" :open="open" :steps="steps" @close="handleOpen(false)" />
</template>

<script lang="ts" setup>
import { ref, createVNode } from 'vue';
import { EllipsisOutlined } from '@xiaoye-ui/icons';
import type { TourProps } from 'xiaoye-ui';

const open = ref<boolean>(false);

const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);
const current = ref(0);
const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    cover: createVNode('img', {
      alt: 'tour.png',
      src: 'https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png',
    }),
    target: () => ref1.value && ref1.value.$el,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => ref2.value && ref2.value.$el,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: () => ref3.value && ref3.value.$el,
  },
];

const handleOpen = (val: boolean): void => {
  open.value = val;
};
</script>
