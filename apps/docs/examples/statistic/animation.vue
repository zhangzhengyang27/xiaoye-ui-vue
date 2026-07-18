<template>
  <div class="animation-wrapper">
    <xy-row :gutter="24">
      <xy-col :span="8">
        <xy-card>
          <xy-statistic
            title="当日营收"
            :value="displayValue"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#3f8600' }"
          />
        </xy-card>
      </xy-col>
      <xy-col :span="8">
        <xy-card>
          <xy-statistic
            title="活跃用户"
            :value="userValue"
            :precision="0"
            suffix="人"
            :value-style="{ color: '#1677ff' }"
          />
        </xy-card>
      </xy-col>
      <xy-col :span="8">
        <xy-card>
          <xy-statistic
            title="转化率"
            :value="rateValue"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#722ed1' }"
          />
        </xy-card>
      </xy-col>
    </xy-row>

    <xy-divider />

    <xy-space :size="8" wrap>
      <xy-button type="primary" :loading="animating" @click="animateAll">触发数值动画</xy-button>
      <xy-button @click="reset">重置</xy-button>
      <xy-segmented v-model:value="duration" :options="durationOptions" size="small" />
      <xy-typography-text type="secondary" style="font-size: 12px">
        动画时长：{{ duration }}ms
      </xy-typography-text>
    </xy-space>

    <xy-alert
      type="info"
      show-icon
      banner
      message="说明"
      description="Statistic 组件本身不内置数值过渡动画。本示例通过 requestAnimationFrame 自定义实现数值插值，达到平滑过渡效果。"
      style="margin-top: 16px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const duration = ref<number>(1200);
const animating = ref<boolean>(false);

// segmented 选项：value 为数值，便于直接绑定到动画时长
const durationOptions = [
  { label: '快速', value: 600 },
  { label: '中速', value: 1200 },
  { label: '慢速', value: 2000 },
];

// 三个目标值
const TARGET_REVENUE = 88421.66;
const TARGET_USERS = 128903;
const TARGET_RATE = 12.86;

const displayValue = ref<number>(0);
const userValue = ref<number>(0);
const rateValue = ref<number>(0);

let rafId: number | null = null;

const tween = (from: number, to: number, durationMs: number, onUpdate: (val: number) => void) => {
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / durationMs);
    // 缓动函数：easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    onUpdate(current);
    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    }
  };
  rafId = requestAnimationFrame(step);
};

const animateAll = () => {
  if (animating.value) return;
  animating.value = true;
  if (rafId) cancelAnimationFrame(rafId);

  let completed = 0;
  const onDone = () => {
    completed += 1;
    if (completed >= 3) {
      animating.value = false;
      message.success('数值更新完成');
    }
  };

  // 三个数值同时进行过渡
  tween(displayValue.value, TARGET_REVENUE, duration.value, val => {
    displayValue.value = val;
    if (Math.abs(val - TARGET_REVENUE) < 0.01) onDone();
  });
  tween(userValue.value, TARGET_USERS, duration.value, val => {
    userValue.value = Math.round(val);
    if (Math.abs(val - TARGET_USERS) < 1) onDone();
  });
  tween(rateValue.value, TARGET_RATE, duration.value, val => {
    rateValue.value = val;
    if (Math.abs(val - TARGET_RATE) < 0.01) onDone();
  });
};

const reset = () => {
  if (rafId) cancelAnimationFrame(rafId);
  displayValue.value = 0;
  userValue.value = 0;
  rateValue.value = 0;
  animating.value = false;
};
</script>

<style scoped>
.animation-wrapper {
  width: 100%;
}
</style>
