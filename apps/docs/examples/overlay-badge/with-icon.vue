<template>
  <xy-space :size="40" align="center">
    <xy-overlay-badge :value="9">
      <span class="icon-wrapper">
        <NotificationOutlined class="icon" />
      </span>
    </xy-overlay-badge>
    <xy-overlay-badge :value="99">
      <span class="icon-wrapper">
        <MailOutlined class="icon" />
      </span>
    </xy-overlay-badge>
    <xy-overlay-badge value="Hot">
      <span class="icon-wrapper">
        <NotificationOutlined class="icon" />
      </span>
    </xy-overlay-badge>
  </xy-space>
</template>

<script lang="ts" setup>
import { NotificationOutlined, MailOutlined } from '@xiaoye-ui/icons';
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f5f5f5;
}
.icon {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
