<template>
  <xy-space :size="24">
    <xy-badge :count="1">
      <xy-avatar shape="square">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-badge>
    <xy-badge dot>
      <xy-avatar shape="square">
        <template #icon><UserOutlined /></template>
      </xy-avatar>
    </xy-badge>
  </xy-space>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@xiaoye-ui/icons';
</script>
