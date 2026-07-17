<template>
  <div>
    <xy-progress type="circle" :percent="75" :format="percent => `${percent} Days`" />
    <xy-progress type="circle" :percent="100" :format="() => 'Done'" />
    <xy-progress type="circle" :percent="75">
      <template #format="percent">
        <span style="color: red">{{ percent }}</span>
      </template>
    </xy-progress>
  </div>
</template>
