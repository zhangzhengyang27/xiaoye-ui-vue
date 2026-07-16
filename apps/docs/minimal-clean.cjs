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
  
  // 5. 删除 HTML 标签
  content = content.replace(/<a-[a-zA-Z-]+[^>]*>[\s\S]*?<\/a-[a-zA-Z-]+>/g, '');
  content = content.replace(/<[a-zA-Z][a-zA-Z0-9]*[^>]*\/>/g, '');
  
  // 6. 删除代码块
  content = content.replace(/```[a-z]*[\s\S]*?```/g, '');
  
  return content;
}

function migrateComponent(name) {
  const sourceFile = path.join(BASE_DIR, 'packages', 'xiaoye-ui', 'src', name, 'index.zh-CN.md');
  const targetFile = path.join(BASE_DIR, 'docs', 'data-display', `${name}.md`);
  
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
  
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  fs.writeFileSync(targetFile, content, 'utf-8');
  return true;
}

for (const comp of components) {
  migrateComponent(comp);
}

console.log('Done!');
