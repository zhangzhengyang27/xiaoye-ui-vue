<template>
  <xy-divider orientation="left">Normal</xy-divider>
  <xy-row>
    <xy-col :span="6" :order="4">1 col-order-4</xy-col>
    <xy-col :span="6" :order="3">2 col-order-3</xy-col>
    <xy-col :span="6" :order="2">3 col-order-2</xy-col>
    <xy-col :span="6" :order="1">4 col-order-1</xy-col>
  </xy-row>
  <xy-divider orientation="left">Responsive</xy-divider>
  <xy-row>
    <xy-col :span="6" :xs="{ order: 1 }" :sm="{ order: 2 }" :md="{ order: 3 }" :lg="{ order: 4 }">
      1 col-order-responsive
    </xy-col>
    <xy-col :span="6" :xs="{ order: 2 }" :sm="{ order: 1 }" :md="{ order: 4 }" :lg="{ order: 3 }">
      2 col-order-responsive
    </xy-col>
    <xy-col :span="6" :xs="{ order: 3 }" :sm="{ order: 4 }" :md="{ order: 2 }" :lg="{ order: 2 }">
      3 col-order-responsive
    </xy-col>
    <xy-col :span="6" :xs="{ order: 4 }" :sm="{ order: 3 }" :md="{ order: 1 }" :lg="{ order: 1 }">
      4 col-order-responsive
    </xy-col>
  </xy-row>
</template>
