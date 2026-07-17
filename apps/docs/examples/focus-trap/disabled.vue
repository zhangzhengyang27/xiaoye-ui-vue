<template>
  <div>
    <xy-space>
      <xy-button type="primary" @click="open = true">打开对话框</xy-button>
      <span class="demo-tip">通过 `disabled` 控制 FocusTrap 是否生效。</span>
    </xy-space>

    <div v-if="open" class="demo-mask" @click.self="open = false">
      <xy-focus-trap :disabled="disabled">
        <div class="demo-dialog" role="dialog" aria-modal="true">
          <h3 class="demo-title">FocusTrap {{ disabled ? '已禁用' : '已启用' }}</h3>
          <p class="demo-desc">启用时：Tab 键循环不会跳出对话框；禁用时：焦点可以离开对话框。</p>
          <div class="demo-switch-row">
            <xy-switch v-model:checked="disabled" />
            <span>disabled = {{ disabled }}</span>
          </div>
          <div class="demo-actions">
            <xy-button @click="open = false">取消</xy-button>
            <xy-button type="primary" @click="open = false">确定</xy-button>
          </div>
        </div>
      </xy-focus-trap>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const open = ref(false);
const disabled = ref(false);
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
  width: 440px;
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
  margin: 0 0 16px;
  font-size: 13px;
  color: #666;
}
.demo-switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #555;
}
.demo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
