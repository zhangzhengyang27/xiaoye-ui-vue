<template>
  <xy-tabs v-model:active-key="activeKey">
    <xy-tab-pane key="1">
      <template #tab>
        <span>
          <apple-outlined />
          Tab 1
        </span>
      </template>
      Tab 1
    </xy-tab-pane>
    <xy-tab-pane key="2">
      <template #tab>
        <span>
          <android-outlined />
          Tab 2
        </span>
      </template>
      Tab 2
    </xy-tab-pane>
  </xy-tabs>
</template>
<script lang="ts" setup>
import { AppleOutlined, AndroidOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
const activeKey = ref('1');
</script>
