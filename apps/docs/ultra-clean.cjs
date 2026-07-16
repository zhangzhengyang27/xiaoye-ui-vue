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
  
  // 5. 删除所有 HTML 标签 - 使用更激进的方式
  content = content.replace(/<[^>]*>/g, '');
  
  // 6. 删除代码块
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // 7. 删除 markdown table 中的对齐标记
  content = content.replace(/\|:\s*-+\s*/g, '|');
  
  // 8. 删除多余的竖线（表格分隔符）
  content = content.replace(/\|\s*\|/g, '|');
  
  // 9. 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // 10. 清理行首行尾空格
  content = content.split('\n').map(line => line.trim()).join('\n');
  
  // 11. 修复孤立的竖线
  content = content.replace(/^\|$/gm, '');
  
  // 12. 清理表格，确保每行有正确的格式
  const lines = content.split('\n');
  const cleanedLines = [];
  for (const line of lines) {
    // 如果是表格行，确保格式正确
    if (line.startsWith('|') && !line.startsWith('|---')) {
      const cells = line.split('|').filter(c => c.trim() !== '');
      if (cells.length > 0) {
        cleanedLines.push('| ' + cells.join(' | ') + ' |');
      } else {
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  }
  content = cleanedLines.join('\n');
  
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

console.log('Ultra-clean migration...\n');

for (const comp of components) {
  const result = migrateComponent(comp);
  console.log(`${comp}: ${result ? 'OK' : 'FAILED'}`);
}

console.log('\nDone!');
