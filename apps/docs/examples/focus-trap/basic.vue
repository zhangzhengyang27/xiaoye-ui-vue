<template>
  <div>
    <xy-button type="primary" @click="open = true">打开对话框</xy-button>
    <p class="demo-tip">点击按钮后，使用 Tab 键在对话框内的按钮间切换，焦点不会跳出对话框边界。</p>

    <xy-button class="demo-outside-btn">外部按钮（不会被聚焦）</xy-button>

    <div v-if="open" class="demo-mask" @click.self="open = false">
      <xy-focus-trap>
        <div class="demo-dialog" role="dialog" aria-modal="true" aria-label="焦点陷阱示例">
          <h3 class="demo-title">焦点被限制在此对话框内</h3>
          <p class="demo-desc">按下 Tab 或 Shift+Tab，焦点只会在下方两个按钮之间循环。</p>
          <div class="demo-actions">
            <xy-button @click="onCancel">取消</xy-button>
            <xy-button type="primary" @click="onConfirm">确定</xy-button>
          </div>
        </div>
      </xy-focus-trap>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const open = ref(false);

const onCancel = () => {
  open.value = false;
};
const onConfirm = () => {
  open.value = false;
};
</script>

<style scoped>
.demo-tip {
  margin: 12px 0;
  font-size: 12px;
  color: #999;
}
.demo-outside-btn {
  margin-left: 12px;
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
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
}
.demo-desc {
  margin: 0 0 20px;
  font-size: 13px;
  color: #666;
}
.demo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
