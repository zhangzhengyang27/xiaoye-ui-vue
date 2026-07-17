<template>
  <div>
    <xy-steps
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
        <xy-popover>
          <template #content>
            <span>step {{ index }} status: {{ status }}</span>
          </template>
          <span :class="`${prefixCls}-icon-dot`" />
        </xy-popover>
      </template>
    </xy-steps>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current = ref<number>(1);
const description = 'You can hover on the dot.';
</script>
