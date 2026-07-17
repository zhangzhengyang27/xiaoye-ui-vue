<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-toolbar>
      <template #start>
        <xy-breadcrumb>
          <xy-breadcrumb-item>首页</xy-breadcrumb-item>
          <xy-breadcrumb-item>项目管理</xy-breadcrumb-item>
          <xy-breadcrumb-item>需求详情</xy-breadcrumb-item>
        </xy-breadcrumb>
      </template>
      <template #end>
        <xy-avatar-group>
          <xy-avatar style="background-color: #f56a00">A</xy-avatar>
          <xy-avatar style="background-color: #87d068">B</xy-avatar>
          <xy-avatar style="background-color: #1677ff">C</xy-avatar>
        </xy-avatar-group>
      </template>
    </xy-toolbar>

    <xy-toolbar>
      <template #start>
        <xy-switch
          v-model:checked="strict"
          checked-children="严格模式"
          un-checked-children="宽松"
        />
      </template>
      <template #center>
        <xy-statistic title="当前进度" :value="76" suffix="%" />
      </template>
      <template #end>
        <xy-tag color="success">进行中</xy-tag>
        <xy-tag color="processing">v1.2.0</xy-tag>
      </template>
    </xy-toolbar>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const strict = ref(true);
</script>
