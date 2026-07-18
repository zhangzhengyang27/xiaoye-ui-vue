<template>
  <xy-watermark :content="lines" :font="{ fontSize: 18, color: 'rgba(22, 119, 255, 0.15)' }">
    <div class="multi-line-content">
      <xy-typography>
        <xy-typography-title :level="4">XiaoyeUI 内部文档</xy-typography-title>
        <xy-typography-paragraph>
          本页面采用多行水印保护内容版权。当文档需要同时显示多条提示信息 （如组织名 +
          文档密级），使用
          <code>content</code>
          数组形式最为合适。
        </xy-typography-paragraph>
        <xy-typography-paragraph type="secondary">
          水印内容为：
          <strong>{{ lines.join(' / ') }}</strong>
        </xy-typography-paragraph>
      </xy-typography>
    </div>
  </xy-watermark>
</template>

<script lang="ts" setup>
// 多行水印：通过 content 字符串数组指定多行内容
const lines: string[] = ['XiaoyeUI', '内部文档'];
</script>

<style scoped>
.multi-line-content {
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  min-height: 320px;
}
</style>
