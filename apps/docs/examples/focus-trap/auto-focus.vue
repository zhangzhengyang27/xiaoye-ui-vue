<template>
  <div>
    <xy-space direction="vertical" :size="8">
      <xy-button type="primary" @click="open = true">打开对话框（autoFocusSelector）</xy-button>
      <span class="demo-tip">
        对话框打开后，会自动聚焦到匹配 `autoFocusSelector` 的元素（此处为用户名输入框）。
      </span>
    </xy-space>

    <div v-if="open" class="demo-mask" @click.self="open = false">
      <xy-focus-trap auto-focus-selector=".demo-autofocus-input">
        <div class="demo-dialog" role="dialog" aria-modal="true">
          <h3 class="demo-title">自动聚焦指定元素</h3>
          <div class="demo-field">
            <label class="demo-field-label">用户名</label>
            <input
              class="demo-native-input demo-autofocus-input"
              placeholder="打开对话框后会自动聚焦此输入框"
            />
          </div>
          <div class="demo-field">
            <label class="demo-field-label">密码</label>
            <input class="demo-native-input" type="password" placeholder="不会自动聚焦" />
          </div>
          <div class="demo-actions">
            <xy-button @click="open = false">取消</xy-button>
            <xy-button type="primary" @click="open = false">登录</xy-button>
          </div>
        </div>
      </xy-focus-trap>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const open = ref(false);
</script>

<style scoped>
.demo-tip {
  font-size: 12px;
  color: #999;
}
.demo-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.demo-dialog {
  width: 420px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.demo-title {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
}
.demo-field {
  margin-bottom: 14px;
}
.demo-field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #555;
}
.demo-native-input {
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.demo-native-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.demo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
</style>
