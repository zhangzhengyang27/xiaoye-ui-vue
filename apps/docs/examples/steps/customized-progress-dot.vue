<template>
  <div>
    <a-steps
      v-model:current="current"
      :items="[
        {
          title: 'Finished',
          description,
        },
        {
          title: 'In Progress',
          description,
        },
        {
          title: 'Waiting',
          description,
        },
        {
          title: 'Waiting',
          description,
        },
      ]"
    >
      <template #progressDot="{ index, status, prefixCls }">
        <a-popover>
          <template #content>
            <span>step {{ index }} status: {{ status }}</span>
          </template>
          <span :class="`${prefixCls}-icon-dot`" />
        </a-popover>
      </template>
    </a-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(1);
const description = 'You can hover on the dot.';
</script>
