<template>
  <div class="components-input-demo-presuffix">
    <xy-input v-model:value="userName" placeholder="Basic usage">
      <template #prefix>
        <user-outlined />
      </template>
      <template #suffix>
        <xy-tooltip title="Extra information">
          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
        </xy-tooltip>
      </template>
    </xy-input>
    <br />
    <br />
    <xy-input prefix="￥" suffix="RMB" />
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined, InfoCircleOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
const userName = ref<string>('');
</script>
