<template>
  <xy-space direction="vertical">
    <xy-dropdown-button type="primary" loading>
      <template #overlay>
        <xy-menu>
          <xy-menu-item key="1">Submit and continue</xy-menu-item>
        </xy-menu>
      </template>
      Submit
    </xy-dropdown-button>
    <xy-dropdown-button type="primary" size="small" loading>
      <template #overlay>
        <xy-menu>
          <xy-menu-item key="1">Submit and continue</xy-menu-item>
        </xy-menu>
      </template>
      Submit
    </xy-dropdown-button>
    <xy-dropdown-button type="primary" :loading="loading1" @click="enterLoading1">
      <template #overlay>
        <xy-menu>
          <xy-menu-item key="1">Submit and continue</xy-menu-item>
        </xy-menu>
      </template>
      Submit
    </xy-dropdown-button>
    <xy-dropdown-button :loading="loading2" @click="enterLoading2">
      Submit
      <template #overlay>
        <xy-menu>
          <xy-menu-item key="1">Submit and continue</xy-menu-item>
        </xy-menu>
      </template>
      <template #icon><DownOutlined /></template>
    </xy-dropdown-button>
  </xy-space>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { DownOutlined } from '@xiaoye-ui/icons';
const loading1 = ref(false);
const loading2 = ref(false);
const enterLoading = (loading: Ref<boolean>) => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 6000);
};
function enterLoading1() {
  enterLoading(loading1);
}
function enterLoading2() {
  enterLoading(loading2);
}
</script>
