<template>
  <xy-toolbar aria-labelledby="toolbar-basic-title">
    <template #start>
      <xy-button type="primary">新建</xy-button>
      <xy-button>导入</xy-button>
    </template>
    <template #center>
      <xy-input-search v-model:value="keyword" placeholder="搜索内容" style="width: 220px" />
    </template>
    <template #end>
      <xy-tooltip title="刷新">
        <xy-button :icon="h(ReloadOutlined)" />
      </xy-tooltip>
      <xy-tooltip title="设置">
        <xy-button :icon="h(SettingOutlined)" />
      </xy-tooltip>
    </template>
  </xy-toolbar>
  <p id="toolbar-basic-title" style="margin-top: 12px; color: #888">
    基础工具栏：通过 start / center / end 三个插槽组织内容。
  </p>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { ReloadOutlined, SettingOutlined } from '@xiaoye-ui/icons';

const keyword = ref('');
</script>
