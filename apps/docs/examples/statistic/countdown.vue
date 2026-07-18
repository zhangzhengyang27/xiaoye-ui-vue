<template>
  <div class="countdown-wrapper">
    <xy-row :gutter="24">
      <xy-col :span="12">
        <xy-card>
          <xy-statistic-countdown
            v-if="running"
            title="距活动开始还有"
            :value="deadline"
            format="s 秒"
            @finish="onFinish"
          />
          <xy-statistic
            v-else
            title="距活动开始还有"
            :value="pausedText"
            :value-style="{ color: '#1677ff' }"
          />
        </xy-card>
      </xy-col>

      <xy-col :span="12">
        <xy-card>
          <xy-statistic-countdown
            v-if="running"
            title="精确到毫秒"
            :value="deadline"
            format="HH:mm:ss:SSS"
            :value-style="{ color: '#fa541c' }"
          />
          <xy-statistic v-else title="精确到毫秒" value="已暂停" :value-style="{ color: '#999' }" />
        </xy-card>
      </xy-col>
    </xy-row>

    <xy-divider />

    <xy-space :size="8" wrap>
      <xy-button type="primary" :disabled="running" @click="handleStart">开始</xy-button>
      <xy-button :disabled="!running" @click="handlePause">暂停</xy-button>
      <xy-button @click="handleReset">重置</xy-button>
      <xy-typography-text type="secondary" style="font-size: 12px">
        说明：Countdown 内部自动启动定时器，通过 v-if 卸载组件模拟「暂停」效果
      </xy-typography-text>
    </xy-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

// 倒计时总时长：10 秒
const DURATION = 1000 * 10;
const deadline = ref<number>(Date.now() + DURATION);
const running = ref<boolean>(true);
const pausedText = ref<string>('已暂停');

const handleStart = () => {
  if (Date.now() >= deadline.value) {
    // 已结束，重新设置截止时间
    deadline.value = Date.now() + DURATION;
  }
  running.value = true;
  message.success('倒计时已开始');
};

const handlePause = () => {
  // 卸载组件即停止定时刷新
  pausedText.value = '已暂停';
  running.value = false;
  message.info('倒计时已暂停');
};

const handleReset = () => {
  deadline.value = Date.now() + DURATION;
  running.value = true;
  message.success('倒计时已重置');
};

const onFinish = () => {
  running.value = false;
  pausedText.value = '已结束';
  message.warning('活动已开始！');
};
</script>

<style scoped>
.countdown-wrapper {
  width: 100%;
}
</style>
