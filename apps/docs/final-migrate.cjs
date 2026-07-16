#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/xiaoye/Desktop/ant-design-vue-main';
const TARGET_DIR = path.join(BASE_DIR, 'docs', 'data-display');

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
  content = content.replace(/<a-[a-zA-Z][^>]*>[\s\S]*?<\/a-[a-zA-Z][^>]*>/g, '');
  content = content.replace(/<[a-zA-Z][a-zA-Z0-9]*[^>]*\/>/g, '');
  content = content.replace(/<[a-zA-Z][a-zA-Z0-9]*[^>]*>[\s\S]*?<\/[a-zA-Z][a-zA-Z0-9]*>/g, '');
  
  // 6. 删除 HTML/JSX/TSX 代码块
  content = content.replace(/```html[\s\S]*?```/g, '');
  content = content.replace(/```jsx[\s\S]*?```/g, '');
  content = content.replace(/```tsx[\s\S]*?```/g, '');
  
  // 7. 修复 markdown table 中的对齐标记
  content = content.replace(/\|:\s*-+/g, '|');
  
  // 8. 删除可能引起问题的 HTML 实体
  // 删除孤立的 < 或 > 字符（不是标签的一部分）
  content = content.replace(/([^=>])\s*<\s*([^\s>])/g, '$1 小于 $2');
  content = content.replace(/([^=<])\s*>\s*([^\s])/g, '$1 大于 $2');
  
  // 9. 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // 10. 清理行首行尾空格
  content = content.split('\n').map(line => line.trim()).join('\n');
  
  return content;
}

function migrateComponent(name) {
  const sourceFile = path.join(BASE_DIR, 'packages', 'xiaoye-ui', 'src', name, 'index.zh-CN.md');
  const targetFile = path.join(TARGET_DIR, `${name}.md`);
  
  if (!fs.existsSync(sourceFile)) {
    console.log(`${name}: Source not found`);
    return false;
  }
  
  let content = fs.readFileSync(sourceFile, 'utf-8');
  
  const apiIndex = content.indexOf('## API');
  if (apiIndex === -1) {
    console.log(`${name}: No ## API section`);
    return false;
  }
  
  content = content.substring(apiIndex);
  content = cleanContent(content);
  
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }
  
  fs.writeFileSync(targetFile, content, 'utf-8');
  console.log(`${name}: OK (${content.length} chars)`);
  return true;
}

console.log('=== Final Migration ===\n');

for (const comp of components) {
  migrateComponent(comp);
}

console.log('\nDone!');
