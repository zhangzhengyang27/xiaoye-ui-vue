<template>
  <xy-row :gutter="16">
    <xy-col :span="12">
      <xy-statistic-countdown :value="deadline" style="margin-right: 50px" @finish="onFinish">
        <template #title>
          <span>Countdown</span>
          <xy-tooltip placement="right">
            <template #title>
              <span>hurry up!</span>
            </template>
            <question-circle-two-tone style="margin-left: 5px" />
          </xy-tooltip>
        </template>
      </xy-statistic-countdown>
    </xy-col>
    <xy-col :span="24" style="margin-top: 32px">
      <xy-statistic-countdown
        title="Million Seconds countdown"
        :value="deadline"
        format="HH:mm:ss:SSS"
        style="margin-right: 50px"
      >
        <template #prefix>
          <span>There's only</span>
        </template>
        <template #suffix>
          <span>left for the end.</span>
        </template>
      </xy-statistic-countdown>
    </xy-col>
  </xy-row>
</template>
<script lang="ts" setup>
import { QuestionCircleTwoTone } from '@xiaoye-ui/icons';
const onFinish = () => {
  console.log('finished!');
};
const deadline = Date.now() + 1000 * 60 * 60 * 20 * 2;
</script>
