<template>
  <xy-space :size="16" wrap>
    <xy-panel title="基础面板" style="width: 300px">
      <p>面板用于将相关内容组织到一个独立的容器中，常配合标题展示信息分组。</p>
      <p>这是面板的正文内容区域。</p>
    </xy-panel>

    <xy-panel title="无边框面板" :bordered="false" style="width: 300px; background: #fafafa">
      <p>
        设置
        <code>bordered</code>
        为 false 可移除边框，适合在已有背景色的容器中使用。
      </p>
    </xy-panel>

    <xy-panel title="可悬停面板" hoverable style="width: 300px">
      <p>
        设置
        <code>hoverable</code>
        为 true 时，鼠标悬停会有阴影提升效果。
      </p>
    </xy-panel>
  </xy-space>
</template>
<script lang="ts" setup></script>
<style scoped>
:deep(.xy-panel p) {
  margin: 4px 0;
}
</style>
