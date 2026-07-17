<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">金额（money）：</span>
      <xy-key-filter preset="money">
        <xy-input
          v-model:value="moneyVal"
          placeholder="数字、小数点、逗号、空格"
          style="width: 240px"
        />
      </xy-key-filter>
      <span class="demo-value">{{ moneyVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">邮箱（email）：</span>
      <xy-key-filter preset="email">
        <xy-input v-model:value="emailVal" placeholder="字母数字 _.-@" style="width: 240px" />
      </xy-key-filter>
      <span class="demo-value">{{ emailVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">字母数字：</span>
      <xy-key-filter preset="alphanum">
        <xy-input v-model:value="alnumVal" placeholder="字母数字下划线" style="width: 240px" />
      </xy-key-filter>
      <span class="demo-value">{{ alnumVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">自定义正则：</span>
      <xy-key-filter :pattern="/[a-z0-9-]/i">
        <xy-input v-model:value="slugVal" placeholder="字母数字短横线" style="width: 240px" />
      </xy-key-filter>
      <span class="demo-value">{{ slugVal || '—' }}</span>
    </div>
    <p class="demo-tip">
      KeyFilter 会自动查找子树中的 `input` / `textarea` 元素作为过滤目标，因此可以直接包裹
      `xy-input` 组件使用。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const moneyVal = ref<string>('');
const emailVal = ref<string>('');
const alnumVal = ref<string>('');
const slugVal = ref<string>('');
</script>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
  width: 140px;
}
.demo-value {
  font-size: 13px;
  color: #1890ff;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
