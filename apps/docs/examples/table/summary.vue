<template>
  <xy-table :columns="columns" :data-source="data" :pagination="false" bordered>
    <template #summary>
      <xy-table-summary-row>
        <xy-table-summary-cell>Total</xy-table-summary-cell>
        <xy-table-summary-cell>
          <xy-typography-text type="danger">{{ totals.totalBorrow }}</xy-typography-text>
        </xy-table-summary-cell>
        <xy-table-summary-cell>
          <xy-typography-text>{{ totals.totalRepayment }}</xy-typography-text>
        </xy-table-summary-cell>
      </xy-table-summary-row>
      <xy-table-summary-row>
        <xy-table-summary-cell>Balance</xy-table-summary-cell>
        <xy-table-summary-cell :col-span="2">
          <xy-typography-text type="danger">
            {{ totals.totalBorrow - totals.totalRepayment }}
          </xy-typography-text>
        </xy-table-summary-cell>
      </xy-table-summary-row>
    </template>
  </xy-table>
  <br />
  <xy-table
    :columns="fixedColumns"
    :data-source="fixedData"
    :pagination="false"
    :scroll="{ x: 2000, y: 500 }"
    bordered
  >
    <template #summary>
      <xy-table-summary fixed>
        <xy-table-summary-row>
          <xy-table-summary-cell :index="0">Summary</xy-table-summary-cell>
          <xy-table-summary-cell :index="1">This is a summary content</xy-table-summary-cell>
        </xy-table-summary-row>
      </xy-table-summary>
    </template>
  </xy-table>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'xiaoye-ui';
import { computed, ref } from 'vue';

const columns = ref<TableColumnsType>([
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Borrow',
    dataIndex: 'borrow',
  },
  {
    title: 'Repayment',
    dataIndex: 'repayment',
  },
]);

const data = ref([
  {
    key: '1',
    name: 'John Brown',
    borrow: 10,
    repayment: 33,
  },
  {
    key: '2',
    name: 'Jim Green',
    borrow: 100,
    repayment: 0,
  },
  {
    key: '3',
    name: 'Joe Black',
    borrow: 10,
    repayment: 10,
  },
  {
    key: '4',
    name: 'Jim Red',
    borrow: 75,
    repayment: 45,
  },
]);

const fixedColumns = ref<TableColumnsType>([
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: true,
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
]);

const fixedData = ref<{ key: number; name: string; description: string }[]>([]);
for (let i = 0; i < 20; i += 1) {
  fixedData.value.push({
    key: i,
    name: ['Light', 'Bamboo', 'Little'][i % 3],
    description: 'Everything that has a beginning, has an end.',
  });
}

const totals = computed(() => {
  let totalBorrow = 0;
  let totalRepayment = 0;

  data.value.forEach(({ borrow, repayment }) => {
    totalBorrow += borrow;
    totalRepayment += repayment;
  });
  return { totalBorrow, totalRepayment };
});
</script>

<style>
#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme='dark'] #components-table-demo-summary tfoot th,
[data-theme='dark'] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
</style>
