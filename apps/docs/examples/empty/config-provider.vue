<template>
  <xy-switch
    v-model:checked="customize"
    un-checked-children="default"
    checked-children="customize"
  />
  <xy-divider />
  <xy-config-provider>
    <template v-if="customize" #renderEmpty>
      <div style="text-align: center">
        <smile-outlined style="font-size: 20px" />
        <p>Data Not Found</p>
      </div>
    </template>
    <div class="config-provider">
      <h3>Select</h3>
      <xy-select :style="style" :options="[]" />

      <h3>TreeSelect</h3>
      <xy-tree-select :style="style" :tree-data="[]" />

      <h3>Cascader</h3>
      <xy-cascader :style="style" :options="[]" :show-search="true" />

      <h3>Transfer</h3>
      <xy-transfer :data-source="[]" />

      <h3>Table</h3>
      <xy-table style="margin-top: 8px" :columns="columns" :data-source="[]" />
      <h3>List</h3>
      <xy-list :data-source="[]" />
    </div>
  </xy-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { SmileOutlined } from '@xiaoye-ui/icons';
const customize = ref<boolean>(false);

const style = { width: '200px' };
const columns = [{ title: 'Name' }, { title: 'Age' }];
</script>
<style scoped>
.code-box-demo .config-provider h3 {
  font-size: inherit;
  margin: 16px 0 8px 0;
}
</style>
