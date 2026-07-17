<template>
  <div id="components-grid-demo-flex-align">
    <xy-divider orientation="left">Align Top</xy-divider>
    <xy-row justify="center" align="top">
      <xy-col :span="4">
        <p class="height-100">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-50">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-120">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-80">col-4</p>
      </xy-col>
    </xy-row>

    <xy-divider orientation="left">Align Middle</xy-divider>
    <xy-row justify="space-around" align="middle">
      <xy-col :span="4">
        <p class="height-100">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-50">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-120">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-80">col-4</p>
      </xy-col>
    </xy-row>

    <xy-divider orientation="left">Align Bottom</xy-divider>
    <xy-row justify="space-between" align="bottom">
      <xy-col :span="4">
        <p class="height-100">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-50">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-120">col-4</p>
      </xy-col>
      <xy-col :span="4">
        <p class="height-80">col-4</p>
      </xy-col>
    </xy-row>
  </div>
</template>

<style lang="less" scoped>
:deep(#components-grid-demo-flex-align) [class~='xy-row'] {
  background: rgba(128, 128, 128, 0.08);
}
</style>
