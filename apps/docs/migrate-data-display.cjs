#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const components = [
  'avatar', 'badge', 'calendar', 'card', 'carousel', 'collapse',
  'comment', 'descriptions', 'empty', 'image', 'list', 'popover',
  'progress', 'qrcode', 'result', 'skeleton', 'statistic', 'table',
  'tag', 'timeline', 'tooltip', 'tree', 'watermark'
];

const BASE_DIR = '/Users/xiaoye/Desktop/ant-design-vue-main';

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
  
  // 6. 删除 HTML/JSX 代码块
  content = content.replace(/```html[\s\S]*?```/g, '');
  content = content.replace(/```jsx[\s\S]*?```/g, '');
  content = content.replace(/```tsx[\s\S]*?```/g, '');
  
  // 7. 修复 markdown table 中的对齐标记
  content = content.replace(/\|:\s*-+/g, '|');
  
  // 8. 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // 9. 清理行首行尾空格
  content = content.split('\n').map(line => line.trim()).join('\n');
  
  return content;
}

function migrateComponent(name) {
  const sourceFile = path.join(BASE_DIR, 'packages', 'xiaoye-ui', 'src', name, 'index.zh-CN.md');
  const targetFile = path.join(BASE_DIR, 'docs', 'data-display', `${name}.md`);
  
  console.log(`Processing ${name}...`);
  console.log(`  Source: ${sourceFile}`);
  console.log(`  Target: ${targetFile}`);
  
  if (!fs.existsSync(sourceFile)) {
    console.log(`  ERROR: Source file not found`);
    return false;
  }
  
  let content = fs.readFileSync(sourceFile, 'utf-8');
  
  // 找到 ## API 部分开始的位置
  const apiIndex = content.indexOf('## API');
  if (apiIndex === -1) {
    console.log(`  ERROR: No ## API section found`);
    return false;
  }
  
  // 从 ## API 开始提取内容
  content = content.substring(apiIndex);
  
  // 清理内容
  content = cleanContent(content);
  
  // 确保目标目录存在
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 写入文件
  fs.writeFileSync(targetFile, content, 'utf-8');
  
  // 验证文件已写入
  if (fs.existsSync(targetFile)) {
    const stats = fs.statSync(targetFile);
    console.log(`  SUCCESS: Created (${stats.size} bytes)`);
    return true;
  } else {
    console.log(`  ERROR: File was not created`);
    return false;
  }
}

// 执行迁移
console.log('=== Starting Data Display Components Migration ===\n');

const migrated = [];
const failed = [];

for (const comp of components) {
  if (migrateComponent(comp)) {
    migrated.push(comp);
  } else {
    failed.push(comp);
  }
  console.log('');
}

console.log('\n=== Migration Summary ===');
console.log(`Successfully migrated: ${migrated.length} components`);
console.log(`Failed: ${failed.length} components`);
if (failed.length > 0) {
  console.log(`Failed components: ${failed.join(', ')}`);
}

// 列出生成的文件
console.log('\n=== Generated Files ===');
const targetDir = path.join(BASE_DIR, 'docs', 'data-display');
if (fs.existsSync(targetDir)) {
  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
  console.log(`Total files: ${files.length}`);
  files.forEach(f => console.log(`  - ${f}`));
}
