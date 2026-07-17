<template>
  <xy-badge :count="99">
    <xy-avatar shape="square" size="large" />
  </xy-badge>
  <xy-badge :count="100">
    <xy-avatar shape="square" size="large" />
  </xy-badge>
  <xy-badge :count="99" :overflow-count="10">
    <xy-avatar shape="square" size="large" />
  </xy-badge>
  <xy-badge :count="1000" :overflow-count="999">
    <xy-avatar shape="square" size="large" />
  </xy-badge>
</template>
