<!-- 自定义按钮：通过 default 插槽自定义按钮内容，组合图标和文字，比纯图标更具语义性 -->
<template>
  <div class="back-top-custom-button-demo">
    <p class="tip">向下滚动页面，按钮将显示为「带图标 + 文字」的自定义样式。</p>
    <div class="long-content">
      <p v-for="n in 16" :key="n" class="paragraph">
        第 {{ n }} 段内容。通过默认插槽可以完全自定义按钮内部结构，
        例如同时展示图标和文字，让回到顶部的操作更具语义性，适用于需要更明确提示的场景。
      </p>
    </div>
    <xy-back-top :visibility-height="100">
      <div class="custom-button">
        <vertical-align-top-outlined />
        <span class="label">顶部</span>
      </div>
    </xy-back-top>
  </div>
</template>

<script lang="ts" setup>
import { VerticalAlignTopOutlined } from '@xiaoye-ui/icons';
</script>

<style scoped>
.back-top-custom-button-demo .tip {
  margin: 0 0 12px;
  color: #1677ff;
}

.back-top-custom-button-demo .long-content {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.back-top-custom-button-demo .paragraph {
  margin: 0 0 12px;
  color: #595959;
  line-height: 1.6;
}

.back-top-custom-button-demo .custom-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #1677ff;
  border-radius: 50%;
  font-size: 12px;
  line-height: 1.2;
}

.back-top-custom-button-demo .custom-button .label {
  margin-top: 2px;
}
</style>
