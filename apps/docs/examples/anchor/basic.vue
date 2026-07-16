<template>
  <a-anchor
    :items="[
      {
        key: 'part-1',
        href: '#part-1',
        title: () => h('span', { style: 'color: red' }, 'Part 1'),
      },
      {
        key: 'part-2',
        href: '#part-2',
        title: 'Part 2',
      },
      {
        key: 'part-3',
        href: '#part-3',
        title: 'Part 3',
      },
    ]"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
</script>
