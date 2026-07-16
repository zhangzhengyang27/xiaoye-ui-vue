<docs>
---
order: 6
title:
  zh-CN: 自定义指示符
  en-US: Custom spinning indicator
---

## zh-CN

使用自定义指示符。

## en-US

Use custom loading indicator.

</docs>

<template>
  <a-spin :indicator="indicator" />
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
