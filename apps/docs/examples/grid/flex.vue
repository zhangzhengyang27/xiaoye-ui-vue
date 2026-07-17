<template>
  <div id="components-grid-demo-flex">
    <xy-divider orientation="left">sub-element align left</xy-divider>
    <xy-row justify="start">
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
    </xy-row>

    <xy-divider orientation="left">sub-element align center</xy-divider>
    <xy-row justify="center">
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
    </xy-row>

    <xy-divider orientation="left">sub-element align right</xy-divider>
    <xy-row justify="end">
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
    </xy-row>

    <xy-divider orientation="left">sub-element monospaced arrangement</xy-divider>
    <xy-row justify="space-between">
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
    </xy-row>

    <xy-divider orientation="left">sub-element align full</xy-divider>
    <xy-row justify="space-around">
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
    </xy-row>

    <xy-divider orientation="left">sub-element align full</xy-divider>
    <xy-row justify="space-evenly">
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
      <xy-col :span="4">col-4</xy-col>
    </xy-row>
  </div>
</template>

<style lang="less" scoped>
:deep(#components-grid-demo-flex) [class~='xy-row'] {
  background: rgba(128, 128, 128, 0.08);
}
</style>
