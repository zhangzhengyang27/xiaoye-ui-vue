<template>
  <div>
    <a-progress type="circle" :percent="75" :format="percent => `${percent} Days`" />
    <a-progress type="circle" :percent="100" :format="() => 'Done'" />
    <a-progress type="circle" :percent="75">
      <template #format="percent">
        <span style="color: red">{{ percent }}</span>
      </template>
    </a-progress>
  </div>
</template>
