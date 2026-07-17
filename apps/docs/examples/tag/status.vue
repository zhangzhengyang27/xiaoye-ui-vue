<template>
  <xy-divider orientation="left">Without icon</xy-divider>
  <div>
    <xy-tag color="success">success</xy-tag>
    <xy-tag color="processing">processing</xy-tag>
    <xy-tag color="error">error</xy-tag>
    <xy-tag color="warning">warning</xy-tag>
    <xy-tag color="default">default</xy-tag>
  </div>
  <xy-divider orientation="left">With icon</xy-divider>
  <div>
    <xy-tag color="success">
      <template #icon>
        <check-circle-outlined />
      </template>
      success
    </xy-tag>
    <xy-tag color="processing">
      <template #icon>
        <sync-outlined :spin="true" />
      </template>
      processing
    </xy-tag>
    <xy-tag color="error">
      <template #icon>
        <close-circle-outlined />
      </template>
      error
    </xy-tag>
    <xy-tag color="warning">
      <template #icon>
        <exclamation-circle-outlined />
      </template>
      warning
    </xy-tag>
    <xy-tag color="default">
      <template #icon>
        <clock-circle-outlined />
      </template>
      waiting
    </xy-tag>
    <xy-tag color="default">
      <template #icon>
        <minus-circle-outlined />
      </template>
      stop
    </xy-tag>
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
} from '@xiaoye-ui/icons';
</script>
