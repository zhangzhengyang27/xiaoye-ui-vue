<template>
  <a-table
    :columns="columns"
    :row-key="record => record.login.uuid"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { TableProps } from 'xiaoye-ui';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = reactive({
  total: 200,
  current: 1,
  pageSize: 10,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await fetch(
      `https://randomuser.me/api?noinfo&page=${pagination.current}&results=${pagination.pageSize}`
    );
    const data = await res.json();
    dataSource.value = data.results;
    pagination.total = 200;
  } finally {
    loading.value = false;
  }
};

const handleTableChange: TableProps['onChange'] = (
  pag: { pageSize: number; current: number },
  _filters: any,
  sorter: any
) => {
  pagination.pageSize = pag.pageSize;
  pagination.current = pag.current;
  if (sorter.order) {
    dataSource.value = [...dataSource.value].sort((a, b) =>
      sorter.order === 'ascend' ? a.name.first.localeCompare(b.name.first) : b.name.first.localeCompare(a.name.first)
    );
  }
  fetchData();
};

fetchData();
</script>
