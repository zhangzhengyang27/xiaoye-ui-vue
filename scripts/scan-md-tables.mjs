#!/usr/bin/env node
/**
 * 扫描 markdown 文件，检测 GFM 表格语法错误：
 *   - 分隔行（| --- | --- | ... |）的列数 != 表头行列数
 *   - 单元格内的 | 未转义（破坏列边界）
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.argv[2] || 'apps/docs/components';
const exts = new Set(['.md', '.mdx']);

const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (exts.has(path.extname(ent.name))) files.push(p);
  }
}
walk(ROOT);

let totalErrors = 0;
const summary = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const errors = [];

  let i = 0;
  while (i < lines.length - 1) {
    const header = lines[i];
    const sep = lines[i + 1];
    const headerIsTable = /^\s*\|.*\|\s*$/.test(header);
    const sepIsTable = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(sep);
    if (!(headerIsTable && sepIsTable)) { i++; continue; }

    const countCols = (row) => {
      // 计算 | 边界列数。忽略单元格内 \| (转义)
      let s = row;
      // 先把 \| 替换成占位符，避免被当成列分隔
      s = s.replace(/\\\|/g, '\x00');
      // 去掉首尾 |
      s = s.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
      const parts = s.split('|');
      return parts.length;
    };

    const headerCols = countCols(header);
    const sepCols = countCols(sep);

    if (sepCols !== headerCols) {
      errors.push({
        line: i + 2,
        msg: `分隔行列数(${sepCols}) != 表头列数(${headerCols})`,
        headerLine: i + 1,
      });
    }

    // 检查表头内是否包含未转义的 | —— 但因为我们上面已经按 \| 替换后 split，
    // 如果 countCols(原文未转义版) != headerCols，说明有未转义的 |
    const rawHeaderCols = header.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').length;
    if (rawHeaderCols > headerCols) {
      // 可能是 \| 被正确处理；这里 rawHeaderCols 包含转义和未转义 |
      // 但 split 后多出来的列说明有未转义的 | —— 我们已经在 countCols 里替换了 \|
      // 所以这里 rawHeaderCols > headerCols 必然表示有未转义的 |
      errors.push({
        line: i + 1,
        msg: `表头行包含未转义的 | (列数 ${rawHeaderCols}, 期望 ${headerCols})`,
        headerLine: i + 1,
      });
    }

    // 检查表体
    let j = i + 2;
    while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j]) && !/^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(lines[j])) {
      const bodyRow = lines[j];
      const escapedRow = bodyRow.replace(/\\\|/g, '\x00');
      const cellsExpected = headerCols;
      // 列数 = 转义后 | 的数量 + 1
      const colCount = escapedRow.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').length;
      if (colCount !== cellsExpected) {
        // 可能是 \| 已正确转义导致 split 数等于期望；只有多于或少于才报错
        // 但 row 内原本有 \| 的，转义后不分割，会减少列数。这里比较转义后列数。
        // 若实际分隔（带未转义 |）的列数 != 期望，提示。
        const rawColCount = bodyRow.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').length;
        if (rawColCount !== cellsExpected) {
          errors.push({
            line: j + 1,
            msg: `表体行列数(${rawColCount}) != 表头列数(${cellsExpected})（可能存在未转义的 |）`,
            headerLine: i + 1,
          });
        }
      }
      j++;
    }

    i = j;
  }

  if (errors.length) {
    summary.push({ file, errors });
    totalErrors += errors.length;
  }
}

if (totalErrors === 0) {
  console.log(`✓ 扫描完成：${files.length} 个文件，全部通过。`);
  process.exit(0);
}

console.log(`✗ 发现 ${totalErrors} 处问题（${summary.length} 个文件）：\n`);
for (const { file, errors } of summary) {
  console.log(`── ${file} ──`);
  for (const e of errors) {
    console.log(`  L${e.line}: ${e.msg}`);
  }
  console.log('');
}
process.exit(1);