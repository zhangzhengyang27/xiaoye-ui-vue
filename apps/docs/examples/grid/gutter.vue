<template>
  <xy-divider orientation="left">Horizontal</xy-divider>
  <xy-row :gutter="16">
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
  </xy-row>
  <xy-divider orientation="left">Responsive</xy-divider>
  <xy-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
  </xy-row>
  <xy-divider orientation="left">Vertical</xy-divider>
  <xy-row :gutter="[16, 24]">
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
    <xy-col class="gutter-row" :span="6">
      <div class="gutter-box">col-6</div>
    </xy-col>
  </xy-row>
</template>
<style scoped>
.gutter-box {
  background: #0092ff;
  padding: 8px 0;
}
</style>
```
