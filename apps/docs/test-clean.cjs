#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/xiaoye/Desktop/ant-design-vue-main';

const components = [
  'avatar', 'badge', 'calendar', 'card', 'carousel', 'collapse',
  'comment', 'descriptions', 'empty', 'image', 'list', 'popover',
  'progress', 'qrcode', 'result', 'skeleton', 'statistic', 'table',
  'tag', 'timeline', 'tooltip', 'tree', 'watermark'
];

function cleanContent(content) {
  // 1. 删除 ::: demo ... ::: 代码块
  content = content.replace(/::: demo[\s\S]*?:::/g, '');
  
  // 2. 删除 HTML 注释
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // 3. 删除 <template> 块
  content = content.replace(/<template>[\s\S]*?<\/template>/g, '');
  
  // 4. 删除 <script> 块
  content = content.replace(/<script[\s\S]*?<\/script>/g, '');
  
  // 5. 删除所有 HTML 标签（包括 Vue 组件标签）
  // 先删除非自闭合标签
  content = content.replace(/<a-[a-zA-Z][^>]*>[\s\S]*?<\/a-[a-zA-Z][^>]*>/gi, '');
  // 删除自闭合标签
  content = content.replace(/<[a-zA-Z][a-zA-Z0-9]*[^>]*\/>/gi, '');
  // 删除普通 HTML 标签
  content = content.replace(/<[a-zA-Z][a-zA-Z0-9]*[^>]*>[\s\S]*?<\/[a-zA-Z][a-zA-Z0-9]*>/gi, '');
  
  // 6. 删除 HTML/JSX/TSX 代码块
  content = content.replace(/```html[\s\S]*?```/gi, '');
  content = content.replace(/```jsx[\s\S]*?```/gi, '');
  content = content.replace(/```tsx[\s\S]*?```/gi, '');
  content = content.replace(/```vue[\s\S]*?```/gi, '');
  
  // 7. 删除 markdown table 中的对齐标记
  content = content.replace(/\|:\s*-+\s*/g, '|');
  
  // 8. 清理可能引起 Vue 解析问题的特殊字符
  // 删除 HTML 实体编码
  content = content.replace(/&lt;/gi, '<');
  content = content.replace(/&gt;/gi, '>');
  content = content.replace(/&amp;/gi, '&');
  
  // 9. 清理 v-slot 等 Vue 特有语法（简化处理）
  // 将 v-slot 转换为普通文本格式
  content = content.replace(/v-slot:(\w+)="\{([^}]*)\}"/gi, '[v-slot:$1: $2]');
  
  // 10. 删除 TypeScript 类型定义中的冒号（简单处理）
  // 匹配 : 类型 格式
  content = content.replace(/:\s*(string|number|boolean|object|array|function|void|any|Array|Object)/gi, ' $1');
  
  // 11. 删除任何尖括号内的内容（额外的安全措施）
  content = content.replace(/<[^>]+>/gi, '');
  
  // 12. 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // 13. 清理行首行尾空格
  content = content.split('\n').map(line => line.trim()).join('\n');
  
  return content;
}

function migrateComponent(name) {
  const sourceFile = path.join(BASE_DIR, 'packages', 'xiaoye-ui', 'src', name, 'index.zh-CN.md');
  const targetFile = path.join('/tmp/data-display', `${name}.md`);
  
  if (!fs.existsSync(sourceFile)) {
    return false;
  }
  
  let content = fs.readFileSync(sourceFile, 'utf-8');
  
  const apiIndex = content.indexOf('## API');
  if (apiIndex === -1) {
    return false;
  }
  
  content = content.substring(apiIndex);
  content = cleanContent(content);
  
  fs.writeFileSync(targetFile, content, 'utf-8');
  return true;
}

console.log('Migrating to /tmp/data-display...\n');

for (const comp of components) {
  const result = migrateComponent(comp);
  console.log(`${comp}: ${result ? 'OK' : 'FAILED'}`);
}

console.log('\nDone!');
