<template>
  <div>
    <a-progress
      type="circle"
      trail-color="#e6f4ff"
      :percent="60"
      :stroke-width="20"
      :size="12"
      :format="number => `进行中，已完成${number}%`"
    />
    <span :style="{ marginLeft: 8 }">代码发布</span>
  </div>
</template>
