<template>
  <xy-float-button-group trigger="click" type="primary" :style="{ right: '24px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <xy-float-button />
    <xy-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </xy-float-button>
  </xy-float-button-group>
  <xy-float-button-group trigger="hover" type="primary" :style="{ right: '94px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <xy-float-button />
    <xy-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </xy-float-button>
  </xy-float-button-group>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined, CommentOutlined } from '@xiaoye-ui/icons';
</script>
