<template>
  <a-space direction="vertical" style="width: 100%">
    <a-progress :percent="50" :steps="3" />
    <a-progress :percent="30" :steps="5" />
    <a-progress :percent="100" :steps="5" size="small" stroke-color="#52c41a" />
    <a-progress :percent="60" :steps="5" :stroke-color="['#52c41a', '#52c41a', '#f5222d']" />
  </a-space>
</template>
