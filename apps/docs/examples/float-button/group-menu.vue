<template>
  <a-float-button-group trigger="click" type="primary" :style="{ right: '24px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
  <a-float-button-group trigger="hover" type="primary" :style="{ right: '94px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined, CommentOutlined } from '@ant-design/icons-vue';
</script>
