<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">默认（拦截）：</span>
      <xy-key-filter preset="int">
        <input
          v-model="blockVal"
          class="demo-input"
          :class="{ 'is-error': blockError }"
          placeholder="非法字符被拦截"
        />
      </xy-key-filter>
      <span class="demo-value">{{ blockVal || '—' }}</span>
    </div>
    <div class="demo-row">
      <span class="demo-label">仅验证：</span>
      <xy-key-filter preset="int" validate-only>
        <input
          v-model="validateVal"
          class="demo-input"
          :class="{ 'is-error': validateError }"
          placeholder="允许输入但标记非法"
          @input="onValidate"
        />
      </xy-key-filter>
      <span class="demo-value" :class="{ 'is-error-text': validateError }">
        {{ validateVal || '—' }}
      </span>
    </div>
    <p class="demo-tip">
      默认模式下非法按键会被阻止；设置 `validate-only`
      后不会阻止输入，但会根据预设校验整体值，便于配合自定义错误提示。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const blockVal = ref('');
const blockError = ref(false);
const validateVal = ref('');
const validateError = ref(false);

const VALIDATE_RE = /^-?\d*$/;

const onValidate = () => {
  validateError.value = !VALIDATE_RE.test(validateVal.value);
};
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
.demo-input {
  width: 240px;
  height: 32px;
  padding: 4px 11px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.demo-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.demo-input.is-error {
  border-color: #ff4d4f;
}
.demo-input.is-error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}
.demo-value {
  font-size: 13px;
  color: #1890ff;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.demo-value.is-error-text {
  color: #ff4d4f;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
