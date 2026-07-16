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
  
  // 5. 删除所有 HTML 标签
  content = content.replace(/<[^>]+>/g, '');
  
  // 6. 删除代码块
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // 7. 删除 markdown table 中的对齐标记
  content = content.replace(/\|:\s*-+\s*/g, '|');
  
  // 8. 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // 9. 清理行首行尾空格
  content = content.split('\n').map(line => line.trim()).join('\n');
  
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

console.log('Migrating data-display components...\n');

const success = [];
const failed = [];

for (const comp of components) {
  if (migrateComponent(comp)) {
    success.push(comp);
    console.log(`${comp}: OK`);
  } else {
    failed.push(comp);
    console.log(`${comp}: FAILED`);
  }
}

console.log(`\nSuccess: ${success.length}, Failed: ${failed.length}`);
