<!-- 自定义显示高度：演示 visibilityHeight 属性，滚动超过 200px 才显示回到顶部按钮，避免在小幅滚动时打扰用户 -->
<template>
  <div class="back-top-visibility-demo">
    <xy-alert
      type="info"
      show-icon
      :message="`滚动超过 ${visibilityHeight}px 后才会出现回到顶部按钮`"
      style="margin-bottom: 16px"
    />
    <div class="long-content">
      <p v-for="n in 20" :key="n" class="paragraph">
        第 {{ n }} 段：向下滚动查看效果。设置较大的 visibilityHeight 可避免轻微滚动就出现按钮，
        适用于内容较长、需要明确回到顶部意图的场景。
      </p>
    </div>
    <xy-back-top :visibility-height="visibilityHeight" />
  </div>
</template>

<script lang="ts" setup>
const visibilityHeight = 200;
</script>

<style scoped>
.back-top-visibility-demo .long-content {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.back-top-visibility-demo .paragraph {
  margin: 0 0 12px;
  color: #595959;
  line-height: 1.6;
}
</style>
