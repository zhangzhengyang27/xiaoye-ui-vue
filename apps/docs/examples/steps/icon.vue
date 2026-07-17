<template>
  <xy-steps :items="items"></xy-steps>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@xiaoye-ui/icons';
import { StepProps } from 'xiaoye-ui';
const items = [
  {
    title: 'Login',
    status: 'finish',
    icon: h(UserOutlined),
  },
  {
    title: 'Verification',
    status: 'finish',
    icon: h(SolutionOutlined),
  },
  {
    title: 'Pay',
    status: 'process',
    icon: h(LoadingOutlined),
  },
  {
    title: 'Done',
    status: 'wait',
    icon: h(SmileOutlined),
  },
] as StepProps[];
</script>
