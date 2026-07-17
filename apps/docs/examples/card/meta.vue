<template>
  <xy-card hoverable style="width: 300px">
    <template #cover>
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    </template>
    <template #actions>
      <setting-outlined key="setting" />
      <edit-outlined key="edit" />
      <ellipsis-outlined key="ellipsis" />
    </template>
    <xy-card-meta title="Card title" description="This is the description">
      <template #avatar>
        <xy-avatar src="https://joeschmoe.io/api/v1/random" />
      </template>
    </xy-card-meta>
  </xy-card>
</template>

<script lang="ts" setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@xiaoye-ui/icons';
</script>
