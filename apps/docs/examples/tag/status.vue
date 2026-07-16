<template>
  <a-divider orientation="left">Without icon</a-divider>
  <div>
    <a-tag color="success">success</a-tag>
    <a-tag color="processing">processing</a-tag>
    <a-tag color="error">error</a-tag>
    <a-tag color="warning">warning</a-tag>
    <a-tag color="default">default</a-tag>
  </div>
  <a-divider orientation="left">With icon</a-divider>
  <div>
    <a-tag color="success">
      <template #icon>
        <check-circle-outlined />
      </template>
      success
    </a-tag>
    <a-tag color="processing">
      <template #icon>
        <sync-outlined :spin="true" />
      </template>
      processing
    </a-tag>
    <a-tag color="error">
      <template #icon>
        <close-circle-outlined />
      </template>
      error
    </a-tag>
    <a-tag color="warning">
      <template #icon>
        <exclamation-circle-outlined />
      </template>
      warning
    </a-tag>
    <a-tag color="default">
      <template #icon>
        <clock-circle-outlined />
      </template>
      waiting
    </a-tag>
    <a-tag color="default">
      <template #icon>
        <minus-circle-outlined />
      </template>
      stop
    </a-tag>
  </div>
</template>
<script lang="ts" setup>
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons-vue';
</script>
