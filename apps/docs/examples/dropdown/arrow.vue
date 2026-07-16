<template>
  <a-space style="display: flex; flex-wrap: wrap">
    <template v-for="placement in placements" :key="placement">
      <a-dropdown :placement="placement" arrow>
        <a-button>{{ placement }}</a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-space>
</template>
<script lang="ts" setup>
const placements = ['topLeft', 'top', 'topRight', 'bottomLeft', 'bottom', 'bottomRight'] as const;
</script>
