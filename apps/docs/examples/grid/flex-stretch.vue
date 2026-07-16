<template>
  <a-divider orientation="left">Percentage columns</a-divider>
  <a-row>
    <a-col :flex="2">2 / 5</a-col>
    <a-col :flex="3">3 / 5</a-col>
  </a-row>
  <a-divider orientation="left">Fill rest</a-divider>
  <a-row>
    <a-col flex="100px">100px</a-col>
    <a-col flex="auto">auto</a-col>
  </a-row>
  <a-divider orientation="left">Raw flex style</a-divider>
  <a-row>
    <a-col flex="1 1 200px">1 1 200px</a-col>
    <a-col flex="0 1 300px">0 1 300px</a-col>
  </a-row>
  <a-row :wrap="false">
    <a-col flex="none">
      <div style="padding: 0 16px">none</div>
    </a-col>
    <a-col flex="auto">auto with no-wrap</a-col>
  </a-row>
</template>
