<template>
  <xy-space :size="48" align="center" wrap>
    <!-- 普通按钮徽标 -->
    <xy-overlay-badge :value="12">
      <xy-button>收件箱</xy-button>
    </xy-overlay-badge>

    <!-- 自定义偏移位置：通过 :deep() 修改 .xy-badge-count 的 top/right -->
    <xy-overlay-badge :value="5" class="offset-right">
      <xy-button type="primary">偏移右侧</xy-button>
    </xy-overlay-badge>
    <xy-overlay-badge :value="5" class="offset-top">
      <xy-button type="dashed">偏移上方</xy-button>
    </xy-overlay-badge>

    <!-- 文本徽标 -->
    <xy-overlay-badge value="Hot">
      <xy-button type="primary" danger>热门活动</xy-button>
    </xy-overlay-badge>

    <!-- dot 模式：仅显示红点，不显示数字 -->
    <xy-overlay-badge :value="dotVisible ? 1 : 0" class="dot-mode">
      <xy-button>更新提醒</xy-button>
    </xy-overlay-badge>

    <!-- 控制按钮 -->
    <xy-button @click="dotVisible = !dotVisible">
      {{ dotVisible ? '清除红点' : '显示红点' }}
    </xy-button>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 通过控制 value 是否大于 0 配合 :deep() 实现 dot 视觉效果
const dotVisible = ref<boolean>(true);
</script>

<style scoped>
/* 通过 :deep() 调整底层徽标的位置（OverlayBadge 当前未透传 offset，需通过样式覆盖实现） */
.offset-right :deep(.xy-badge-count) {
  right: -12px;
}
.offset-top :deep(.xy-badge-count) {
  top: -10px;
}

/* dot 模式：将徽标样式改为 8px 红点，隐藏数字内容 */
.dot-mode :deep(.xy-badge-count) {
  width: 8px;
  height: 8px;
  min-width: 8px;
  padding: 0;
  font-size: 0;
  border-radius: 50%;
  background: #ff4d4f;
  box-shadow: 0 0 0 1px #fff;
}
</style>
