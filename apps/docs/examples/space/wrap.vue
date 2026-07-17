<template>
  <xy-space :size="[8, 16]" wrap>
    <template v-for="_i in 20" :key="_i">
      <xy-button>Button</xy-button>
    </template>
  </xy-space>
</template>
