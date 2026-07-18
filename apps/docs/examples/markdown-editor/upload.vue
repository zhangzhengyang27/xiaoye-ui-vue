<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor v-model="content" :height="360" :upload="upload" />

    <div class="demo-tip">
      <p>支持的图片插入方式：</p>
      <ul>
        <li>拖拽图片文件到编辑器</li>
        <li>粘贴截图（Ctrl/Cmd + V）</li>
        <li>点击工具栏的「上传」按钮选择文件</li>
      </ul>
      <p>
        本示例使用
        <code>handler</code>
        自定义上传函数，模拟异步返回结果，无需后端接口即可演示。 实际项目可配置
        <code>url</code>
        字段交给 Vditor 自动上传，或自行实现
        <code>handler</code>
        对接业务接口。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { IUpload } from 'vditor';

const content = ref(`# 图片上传示例

通过 \`upload\` 属性配置图片上传能力。

## 操作方式

1. 拖拽图片文件到编辑器
2. 复制截图后粘贴（Ctrl/Cmd + V）
3. 点击工具栏的「上传」按钮

## 上传响应格式

Vditor 要求上传接口返回如下结构：

\`\`\`json
{
  "msg": "",
  "code": 0,
  "data": {
    "errFiles": [],
    "succMap": {
      "filename.png": "https://example.com/path/to/file.png"
    }
  }
}
\`\`\`

本示例通过 \`handler\` 模拟 800ms 异步上传，返回占位图链接。
`);

// 上传配置：handler 模式模拟异步上传
const upload: IUpload = {
  url: 'https://example.com/api/upload',
  fieldName: 'file',
  max: 5 * 1024 * 1024, // 5MB
  accept: 'image/*',
  multiple: false,
  // 自定义上传函数（模拟异步上传，避免真实接口调用）
  handler(file: File) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          msg: '',
          code: 0,
          data: {
            errFiles: [],
            succMap: {
              [file.name]: `https://via.placeholder.com/640x360?text=${encodeURIComponent(file.name)}`,
            },
          },
        });
      }, 800);
    });
  },
  linkToImgUrl: 'https://example.com/api/link-to-img',
};
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
.demo-tip p {
  margin: 4px 0;
}
.demo-tip ul {
  margin: 4px 0;
  padding-left: 20px;
}
.demo-tip li {
  margin: 2px 0;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
