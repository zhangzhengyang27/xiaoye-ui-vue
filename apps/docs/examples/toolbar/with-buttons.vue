<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-toolbar>
      <template #start>
        <xy-button-group>
          <xy-button type="primary">新建文件夹</xy-button>
          <xy-button type="primary">上传文件</xy-button>
        </xy-button-group>
      </template>
      <template #end>
        <xy-button danger>批量删除</xy-button>
      </template>
    </xy-toolbar>

    <xy-toolbar>
      <template #start>
        <xy-button type="primary" :icon="h(PlusOutlined)">新建订单</xy-button>
        <xy-button :icon="h(ExportOutlined)">导出</xy-button>
        <xy-button :icon="h(PrinterOutlined)">打印</xy-button>
      </template>
      <template #center>
        <xy-select
          v-model:value="status"
          style="width: 140px"
          placeholder="订单状态"
          :options="statusOptions"
        />
      </template>
      <template #end>
        <xy-button type="primary" ghost>高级筛选</xy-button>
      </template>
    </xy-toolbar>
  </xy-space>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { PlusOutlined, ExportOutlined, PrinterOutlined } from '@xiaoye-ui/icons';

const status = ref<string>();
const statusOptions = [
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'shipped', label: '已发货' },
  { value: 'done', label: '已完成' },
];
</script>
