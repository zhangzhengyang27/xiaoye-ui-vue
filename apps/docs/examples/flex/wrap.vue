<template>
  <xy-flex wrap="wrap" gap="small">
    <xy-button v-for="item in new Array(24)" :key="item" type="primary">Button</xy-button>
  </xy-flex>
</template>
