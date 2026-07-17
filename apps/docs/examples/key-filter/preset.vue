<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">整数（int）：</span>
      <xy-key-filter preset="int">
        <input v-model="intVal" class="demo-input" placeholder="数字与负号" />
      </xy-key-filter>
      <span class="demo-value">{{ intVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">数字（num）：</span>
      <xy-key-filter preset="num">
        <input v-model="numVal" class="demo-input" placeholder="数字、小数点、负号" />
      </xy-key-filter>
      <span class="demo-value">{{ numVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">十六进制（hex）：</span>
      <xy-key-filter preset="hex">
        <input v-model="hexVal" class="demo-input" placeholder="0-9 a-f" />
      </xy-key-filter>
      <span class="demo-value">{{ hexVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">字母（alpha）：</span>
      <xy-key-filter preset="alpha">
        <input v-model="alphaVal" class="demo-input" placeholder="字母与下划线" />
      </xy-key-filter>
      <span class="demo-value">{{ alphaVal || '—' }}</span>
    </div>
    <p class="demo-tip">
      KeyFilter 内置 9
      种预设：`pint`、`int`、`pnum`、`money`、`num`、`hex`、`email`、`alpha`、`alphanum`，覆盖常见输入场景。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const intVal = ref('');
const numVal = ref('');
const hexVal = ref('');
const alphaVal = ref('');
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
  width: 160px;
}
.demo-input {
  width: 240px;
  height: 32px;
  padding: 4px 11px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}
.demo-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
