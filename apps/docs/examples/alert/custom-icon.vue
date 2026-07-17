<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-alert message="showIcon = false" type="success">
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert message="Success Tips" type="success" show-icon>
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert message="Informational Notes" type="info" show-icon>
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert message="Warning" type="warning" show-icon>
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert message="Error" type="error" show-icon>
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      type="success"
      show-icon
    >
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert
      message="Informational Notes"
      description="Additional description and informations about copywriting."
      type="info"
      show-icon
    >
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert
      message="Warning"
      description="This is a warning notice about copywriting."
      type="warning"
      show-icon
    >
      <template #icon><smile-outlined /></template>
    </xy-alert>
    <xy-alert
      message="Error"
      description="This is an error message about copywriting."
      type="error"
      show-icon
    >
      <template #icon><smile-outlined /></template>
    </xy-alert>
  </xy-space>
</template>

<script lang="ts" setup>
import { SmileOutlined } from '@xiaoye-ui/icons';
</script>
