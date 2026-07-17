<template>
  <xy-spin :indicator="indicator" />
</template>
<script lang="ts" setup>
import { LoadingOutlined } from '@xiaoye-ui/icons';
import { h } from 'vue';
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px',
  },
  spin: true,
});
</script>
