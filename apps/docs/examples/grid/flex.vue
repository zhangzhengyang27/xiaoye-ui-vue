<template>
  <div id="components-grid-demo-flex">
    <a-divider orientation="left">sub-element align left</a-divider>
    <a-row justify="start">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <a-divider orientation="left">sub-element align center</a-divider>
    <a-row justify="center">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <a-divider orientation="left">sub-element align right</a-divider>
    <a-row justify="end">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <a-divider orientation="left">sub-element monospaced arrangement</a-divider>
    <a-row justify="space-between">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <a-divider orientation="left">sub-element align full</a-divider>
    <a-row justify="space-around">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <a-divider orientation="left">sub-element align full</a-divider>
    <a-row justify="space-evenly">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
:deep(#components-grid-demo-flex) [class~='ant-row'] {
  background: rgba(128, 128, 128, 0.08);
}
</style>
