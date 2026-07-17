<template>
  <xy-row :gutter="16">
    <xy-col :span="12">
      <xy-statistic-countdown
        title="Countdown"
        :value="deadline"
        style="margin-right: 50px"
        @finish="onFinish"
      />
    </xy-col>
    <xy-col :span="12">
      <xy-statistic-countdown
        title="Million Seconds"
        :value="deadline"
        format="HH:mm:ss:SSS"
        style="margin-right: 50px"
      />
    </xy-col>
    <xy-col :span="24" style="margin-top: 32px">
      <xy-statistic-countdown title="Day Level" :value="deadline" format="D 天 H 时 m 分 s 秒" />
    </xy-col>
  </xy-row>
</template>
<script lang="ts" setup>
const onFinish = () => {
  console.log('finished!');
};
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
</script>
