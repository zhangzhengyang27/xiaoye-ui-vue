<!-- 与 Affix 组合：顶部用 affix 固定一个工具栏，配合 back-top 提供回到顶部功能，常见于长页面（文档/详情页）场景 -->
<template>
  <div class="back-top-with-affix-demo">
    <xy-affix :offset-top="0">
      <div class="toolbar">
        <span class="title">文档标题</span>
        <xy-space>
          <xy-button size="small">编辑</xy-button>
          <xy-button size="small">分享</xy-button>
          <xy-button type="primary" size="small">收藏</xy-button>
        </xy-space>
      </div>
    </xy-affix>
    <div class="content">
      <p v-for="n in 18" :key="n" class="paragraph">
        第 {{ n }} 段：滚动页面时，顶部工具栏通过 affix 始终保持可见，
        右下角的回到顶部按钮在滚动超过 200px 后出现，二者组合常见于长文档、详情页等场景。
      </p>
    </div>
    <xy-back-top :visibility-height="200" />
  </div>
</template>

<script lang="ts" setup>
// 纯模板示例：展示 affix 与 back-top 的组合用法，无需额外逻辑
</script>

<style scoped>
.back-top-with-affix-demo .toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.back-top-with-affix-demo .title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.back-top-with-affix-demo .content {
  padding: 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-top: none;
}

.back-top-with-affix-demo .paragraph {
  margin: 0 0 12px;
  color: #595959;
  line-height: 1.6;
}
</style>
