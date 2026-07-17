<template>
  <xy-avatar :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }">
    <template #icon>
      <AntDesignOutlined />
    </template>
  </xy-avatar>
</template>

<script lang="ts" setup>
import { AntDesignOutlined } from '@xiaoye-ui/icons';
</script>
