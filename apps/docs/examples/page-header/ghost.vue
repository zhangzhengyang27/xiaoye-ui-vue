<template>
  <div class="demo-page-header" style="background-color: #f5f5f5; padding: 24px">
    <xy-page-header
      :ghost="ghost"
      title="Title"
      sub-title="This is a subtitle"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <xy-button key="3">Operation</xy-button>
        <xy-button key="2">Operation</xy-button>
        <xy-button key="1" type="primary">Primary</xy-button>
      </template>
      <xy-descriptions size="small" :column="3">
        <xy-descriptions-item label="Created">Lili Qu</xy-descriptions-item>
        <xy-descriptions-item label="Association">
          <a>421421</a>
        </xy-descriptions-item>
        <xy-descriptions-item label="Creation Time">2017-01-10</xy-descriptions-item>
        <xy-descriptions-item label="Effective Time">2017-10-10</xy-descriptions-item>
        <xy-descriptions-item label="Remarks">
          Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
        </xy-descriptions-item>
      </xy-descriptions>
    </xy-page-header>
  </div>
  <xy-checkbox v-model:checked="ghost" style="margin-top: 0.5rem">toggle ghost</xy-checkbox>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const ghost = ref(false);
</script>
<style scoped>
.demo-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
