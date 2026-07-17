<template>
  <div style="width: 170px">
    <xy-progress :percent="30" size="small" />
    <xy-progress :percent="50" size="small" status="active" />
    <xy-progress :percent="70" size="small" status="exception" />
    <xy-progress :percent="100" size="small" />
  </div>
</template>
