<template>
  <xy-space style="display: flex; flex-wrap: wrap">
    <template v-for="placement in placements" :key="placement">
      <xy-dropdown :placement="placement" arrow>
        <xy-button>{{ placement }}</xy-button>
        <template #overlay>
          <xy-menu>
            <xy-menu-item>
              <a href="javascript:;">1st menu item</a>
            </xy-menu-item>
            <xy-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </xy-menu-item>
            <xy-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </xy-menu-item>
          </xy-menu>
        </template>
      </xy-dropdown>
    </template>
  </xy-space>
</template>
<script lang="ts" setup>
const placements = ['topLeft', 'top', 'topRight', 'bottomLeft', 'bottom', 'bottomRight'] as const;
</script>
