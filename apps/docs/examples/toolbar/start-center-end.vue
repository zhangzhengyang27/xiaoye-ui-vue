<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-toolbar>
      <template #start>
        <span class="demo-label">起始区</span>
        <xy-tag color="blue">start</xy-tag>
      </template>
      <template #center>
        <span class="demo-label">居中区</span>
        <xy-tag color="green">center</xy-tag>
      </template>
      <template #end>
        <span class="demo-label">末尾区</span>
        <xy-tag color="orange">end</xy-tag>
      </template>
    </xy-toolbar>

    <xy-toolbar>
      <template #start>
        <xy-button type="primary">保存</xy-button>
      </template>
      <template #center>
        <xy-segmented v-model:value="view" :options="['表格', '卡片', '列表']" />
      </template>
      <template #end>
        <xy-button>取消</xy-button>
      </template>
    </xy-toolbar>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const view = ref('表格');
</script>
<style scoped>
.demo-label {
  color: #999;
  margin-right: 8px;
}
</style>
