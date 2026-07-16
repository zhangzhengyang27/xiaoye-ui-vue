<template>
  <div class="components-input-demo-presuffix">
    <a-input v-model:value="userName" placeholder="Basic usage">
      <template #prefix>
        <user-outlined />
      </template>
      <template #suffix>
        <a-tooltip title="Extra information">
          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
        </a-tooltip>
      </template>
    </a-input>
    <br />
    <br />
    <a-input prefix="￥" suffix="RMB" />
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
const userName = ref<string>('');
</script>
