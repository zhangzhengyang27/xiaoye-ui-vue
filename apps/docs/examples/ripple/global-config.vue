<template>
  <xy-space direction="vertical" :size="16">
    <xy-radio-group v-model:value="mode" button-style="solid">
      <xy-radio-button value="on">全局启用涟漪</xy-radio-button>
      <xy-radio-button value="off">全局关闭涟漪</xy-radio-button>
    </xy-radio-group>

    <xy-config-provider :ripple="mode === 'on'">
      <xy-space wrap>
        <xy-ripple class="demo-box">
          <button class="demo-btn">按钮 1</button>
        </xy-ripple>
        <xy-ripple class="demo-box">
          <button class="demo-btn primary">按钮 2</button>
        </xy-ripple>
        <xy-ripple class="demo-box" :disabled="false">
          <button class="demo-btn">按钮 3（组件未禁用，受全局控制）</button>
        </xy-ripple>
      </xy-space>
    </xy-config-provider>

    <xy-alert
      type="info"
      show-icon
      message="ConfigProvider 的 ripple 属性可全局控制所有 Ripple 组件的启用状态，无需逐个设置 disabled。"
    />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const mode = ref<'on' | 'off'>('on');
</script>
<style scoped>
.demo-box {
  display: inline-block;
}
.demo-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.demo-btn.primary {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
</style>
