<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">仅小写字母：</span>
      <xy-key-filter :pattern="/[a-z]/">
        <input v-model="lowerVal" class="demo-input" placeholder="a-z" />
      </xy-key-filter>
      <span class="demo-value">{{ lowerVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">仅元音字母：</span>
      <xy-key-filter :pattern="/[aeiou]/i">
        <input v-model="vowelVal" class="demo-input" placeholder="aeiou" />
      </xy-key-filter>
      <span class="demo-value">{{ vowelVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">账号字符：</span>
      <xy-key-filter :pattern="/[a-z0-9_]/">
        <input v-model="accountVal" class="demo-input" placeholder="字母数字下划线" />
      </xy-key-filter>
      <span class="demo-value">{{ accountVal || '—' }}</span>
    </div>
    <p class="demo-tip">
      当内置预设不满足需求时，可通过 `pattern` 属性传入自定义正则，正则需匹配单个允许字符。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const lowerVal = ref('');
const vowelVal = ref('');
const accountVal = ref('');
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
