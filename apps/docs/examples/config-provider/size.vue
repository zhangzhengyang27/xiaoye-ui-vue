<template>
  <xy-radio-group v-model:value="componentSize">
    <xy-radio-button value="small">Small</xy-radio-button>
    <xy-radio-button value="middle">Middle</xy-radio-button>
    <xy-radio-button value="large">Large</xy-radio-button>
  </xy-radio-group>
  <xy-divider />
  <xy-config-provider :component-size="componentSize">
    <div class="example">
      <xy-input />
    </div>
    <div class="example">
      <xy-tabs>
        <xy-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</xy-tab-pane>
        <xy-tab-pane key="2" tab="Tab 2">Content of Tab Pane 2</xy-tab-pane>
        <xy-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</xy-tab-pane>
      </xy-tabs>
    </div>
    <div class="example">
      <xy-input-search allow-clear />
    </div>
    <div class="example">
      <xy-textarea allow-clear />
    </div>
    <div class="example">
      <xy-select style="width: 100px" placeholder="select value" :options="[{ value: 'demo' }]" />
    </div>
    <div class="example">
      <xy-datePicker />
    </div>
    <div class="example">
      <xy-range-picker />
    </div>
    <div class="example">
      <xy-button>Button</xy-button>
    </div>
    <div class="example">
      <xy-card title="Card">
        <xy-table :columns="columns" :data-source="dataSource" />
      </xy-card>
    </div>
  </xy-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
type SizeType = 'small' | 'middle' | 'large';

const componentSize = ref<SizeType>('small');
const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
];
const dataSource = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
  },
];
</script>
<style scoped>
.example {
  margin: 16px 0;
}
</style>
