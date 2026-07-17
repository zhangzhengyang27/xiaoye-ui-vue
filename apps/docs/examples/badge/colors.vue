<template>
  <h4 style="margin-bottom: 16px">Presets:</h4>
  <div>
    <div v-for="color in colors" :key="color">
      <xy-badge :color="color" :text="color" />
    </div>
  </div>
  <xy-divider orientation="left">Custom</xy-divider>
  <xy-badge color="#f50" text="#f50" />
  <br />
  <xy-badge color="#2db7f5" text="#2db7f5" />
  <br />
  <xy-badge color="#87d068" text="#87d068" />
  <br />
  <xy-badge color="#108ee9" text="#108ee9" />
</template>
<script lang="ts" setup>
const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];
</script>
