<template>
  <div>
    <xy-space direction="vertical" style="width: 50%">
      <xy-progress :percent="50" />
      <xy-progress :percent="50" size="small" />
      <xy-progress :percent="50" :size="[300, 20]" />
    </xy-space>
    <br />
    <br />
    <xy-space :size="30">
      <xy-progress type="circle" :percent="50" />
      <xy-progress type="circle" :percent="50" size="small" />
      <xy-progress type="circle" :percent="50" :size="20" />
    </xy-space>
    <br />
    <br />
    <xy-space :size="30">
      <xy-progress type="dashboard" :percent="50" />
      <xy-progress type="dashboard" :percent="50" size="small" />
      <xy-progress type="dashboard" :percent="50" :size="20" />
    </xy-space>
    <br />
    <br />
    <xy-space :size="30">
      <xy-progress :steps="3" :percent="50" />
      <xy-progress :steps="3" :percent="50" size="small" />
      <xy-progress :steps="3" :percent="50" :size="20" />
      <xy-progress :steps="3" :percent="50" :size="[20, 30]" />
    </xy-space>
  </div>
</template>
