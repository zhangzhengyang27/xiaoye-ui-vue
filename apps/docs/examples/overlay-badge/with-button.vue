<template>
  <xy-space :size="24" align="center">
    <xy-overlay-badge :value="3">
      <xy-button>待办事项</xy-button>
    </xy-overlay-badge>
    <xy-overlay-badge :value="12">
      <xy-button type="primary">收件箱</xy-button>
    </xy-overlay-badge>
    <xy-overlay-badge value="New">
      <xy-button type="dashed">新功能</xy-button>
    </xy-overlay-badge>
  </xy-space>
</template>

<script lang="ts" setup></script>
