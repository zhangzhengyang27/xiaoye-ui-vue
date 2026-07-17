<template>
  <xy-space :size="40" align="center">
    <xy-overlay-badge :value="8" size="small" class="badge-green">
      <xy-avatar shape="square" :size="44" />
    </xy-overlay-badge>
    <xy-overlay-badge :value="8" class="badge-blue">
      <xy-avatar shape="square" :size="44" />
    </xy-overlay-badge>
    <xy-overlay-badge :value="8" size="large" class="badge-purple">
      <xy-avatar shape="square" :size="44" />
    </xy-overlay-badge>
    <xy-overlay-badge value="OK" class="badge-orange">
      <xy-avatar shape="square" :size="44" />
    </xy-overlay-badge>
  </xy-space>
</template>

<script lang="ts" setup></script>

<style scoped>
.badge-green :deep(.xy-badge-count) {
  background: #52c41a;
}
.badge-blue :deep(.xy-badge-count) {
  background: #1677ff;
}
.badge-purple :deep(.xy-badge-count) {
  background: #722ed1;
}
.badge-orange :deep(.xy-badge-count) {
  background: #fa8c16;
}
</style>
