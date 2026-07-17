<template>
  <div>
    <xy-space direction="vertical" :size="8">
      <xy-button type="primary" @click="open = true">打开对话框（自定义选择器）</xy-button>
      <span class="demo-tip">
        通过 `firstFocusableSelector` 与 `lastFocusableSelector`
        显式指定首/尾可聚焦元素，绕过默认查询顺序。
      </span>
    </xy-space>

    <div v-if="open" class="demo-mask" @click.self="open = false">
      <xy-focus-trap first-focusable-selector=".demo-last" last-focusable-selector=".demo-first">
        <div class="demo-dialog" role="dialog" aria-modal="true">
          <h3 class="demo-title">自定义可聚焦元素顺序</h3>
          <p class="demo-desc">
            默认情况下首个可聚焦元素为「取消」，末尾为「确定」。
            <br />
            本示例反转了顺序：首个聚焦「确定」，末尾为「取消」。
          </p>
          <div class="demo-actions">
            <xy-button class="demo-last" @click="open = false">取消</xy-button>
            <xy-button class="demo-first" type="primary" @click="open = false">确定</xy-button>
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
  margin: 0 0 20px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}
.demo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
