<template>
  <xy-progress :percent="30" />
  <xy-progress :percent="50" status="active" />
  <xy-progress :percent="70" status="exception" />
  <xy-progress :percent="100" />
  <xy-progress :percent="50" :show-info="false" />
</template>
