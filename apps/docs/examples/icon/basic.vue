<template>
  <a-space>
    <home-outlined />
    <setting-filled />
    <smile-outlined />
    <sync-outlined spin />
    <smile-outlined :rotate="180" />
    <loading-outlined />
  </a-space>
</template>
<script lang="ts" setup>
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@xiaoye-ui/icons';
</script>
