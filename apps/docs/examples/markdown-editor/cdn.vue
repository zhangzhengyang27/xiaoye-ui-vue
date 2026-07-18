<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor v-model="content" :height="320" cdn="https://unpkg.com/vditor@3.11.2" />
    <div class="demo-tip">
      通过
      <code>cdn</code>
      属性可指定 Vditor 子资源加载地址。此处显式指定为
      <code>https://unpkg.com/vditor@3.11.2</code>
      ，可锁定版本或替换为自建 CDN / 本地路径。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(`# CDN 配置

Vditor 默认从 unpkg CDN 加载子资源（表情图片、数学公式引擎、代码高亮等）。

## 自建 CDN

将 \`vditor/dist\` 目录部署到自有 CDN 或本地服务器，通过 \`cdn\` 属性指定路径即可：

\`\`\`vue
<xy-markdown-editor cdn="https://your-cdn.com/vditor@3.11.2" />
\`\`\`

## 本地路径

\`\`\`vue
<xy-markdown-editor cdn="/assets/vditor" />
\`\`\`

确保路径下包含 \`dist\` 子目录结构。
`);
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
