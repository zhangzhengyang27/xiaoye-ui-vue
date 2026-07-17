<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-progress :percent="50" :steps="3" />
    <xy-progress :percent="30" :steps="5" />
    <xy-progress :percent="100" :steps="5" size="small" stroke-color="#52c41a" />
    <xy-progress :percent="60" :steps="5" :stroke-color="['#52c41a', '#52c41a', '#f5222d']" />
  </xy-space>
</template>
