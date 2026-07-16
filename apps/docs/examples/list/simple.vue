<template>
  <h3 :style="{ margin: '16px 0' }">Small Size</h3>
  <a-list size="small" bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
  <h3 :style="{ marginBottom: '16px' }">Default Size</h3>
  <a-list bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
  <h3 :style="{ margin: '16px 0' }">Large Size</h3>
  <a-list size="large" bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
const data: string[] = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];
</script>
