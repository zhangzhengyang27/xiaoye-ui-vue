#!/usr/bin/env node
/**
 * 修复 markdown 表格语法：
 *   - 分隔行列数 != 表头列数  -> 规范化分隔行
 *   - 表体行列数 != 表头列数  -> 补/截断列
 *
 * 不动表头列数（假定表头正确；如果表头错了，扫描器会指向表头下方分隔行）。
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

const SEP_RE = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/;

function escapePipesOutsideCode(s) {
  // 把单元格内的 | 转成 \|，但保留代码片段里的 |
  // 简化策略：把 ` ... ` 内容替换成占位符，处理完再换回
  return s;
}

function splitCells(row) {
  // 先去掉首尾 |，然后按 | 切分（不处理 \| —— 修复阶段我们只关心列数）
  let s = row.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
  return s.split('|');
}

function normalizeRow(row, expectedCols) {
  const cells = splitCells(row);
  if (cells.length === expectedCols) return row;

  if (cells.length > expectedCols) {
    // A. 多 1 列且最后一列为空 → 丢弃末尾空列（常见 trailing | | 误打）
    if (cells.length === expectedCols + 1 && cells[cells.length - 1].trim() === '') {
      return '| ' + cells.slice(0, expectedCols).map(c => c.trim()).join(' | ') + ' |';
    }
    // B. 多 ≥2 列：通常是"类型"列里 union type 的 | 没转义。
    //    策略：保留首 2 列（成员/说明），合并中间多余 cells 到"类型列"，
    //    并对内容里的 | 加反斜杠转义（GFM 表格要求），再保留尾部 N-2 列。
    const midEnd = cells.length - (expectedCols - 2);
    const head = cells.slice(0, 2);
    const midRaw = cells.slice(2, midEnd).join('|');
    const midEscaped = midRaw.replace(/\|/g, '\\|');
    const tail = cells.slice(midEnd);
    const merged = [...head, midEscaped, ...tail];
    if (merged.length === expectedCols) {
      return '| ' + merged.map(c => c.trim()).join(' | ') + ' |';
    }
    // fallback：粗暴合并到最后一列
    const head2 = cells.slice(0, expectedCols - 1);
    const tailRaw2 = cells.slice(expectedCols - 1).join('|');
    const tailEscaped2 = tailRaw2.replace(/\|/g, '\\|');
    return '| ' + [...head2, tailEscaped2].map(c => c.trim()).join(' | ') + ' |';
  } else {
    while (cells.length < expectedCols) cells.push('');
    return '| ' + cells.map(c => c.trim()).join(' | ') + ' |';
  }
}

function makeSep(expectedCols) {
  const cells = Array(expectedCols).fill('---');
  return '| ' + cells.join(' | ') + ' |';
}

let totalFixed = 0;
const report = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let changed = false;
  const fileReport = [];

  let i = 0;
  while (i < lines.length - 1) {
    const header = lines[i];
    const sep = lines[i + 1];
    const headerIsTable = /^\s*\|.*\|\s*$/.test(header);
    const sepIsTable = SEP_RE.test(sep);
    if (!(headerIsTable && sepIsTable)) { i++; continue; }

    const headerCells = splitCells(header);
    const expected = headerCells.length;

    // 1) 修分隔行
    const sepCells = splitCells(sep);
    if (sepCells.length !== expected) {
      const fixed = makeSep(expected);
      fileReport.push({ line: i + 2, from: sep, to: fixed });
      lines[i + 1] = fixed;
      changed = true;
      totalFixed++;
    }

    // 2) 修表体行
    let j = i + 2;
    while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j]) && !SEP_RE.test(lines[j])) {
      const bodyRow = lines[j];
      const bodyCells = splitCells(bodyRow);
      if (bodyCells.length !== expected) {
        const fixed = normalizeRow(bodyRow, expected);
        fileReport.push({ line: j + 1, from: bodyRow, to: fixed });
        lines[j] = fixed;
        changed = true;
        totalFixed++;
      }
      j++;
    }
    i = j;
  }

  if (changed) {
    fs.writeFileSync(file, lines.join('\n'));
    report.push({ file, changes: fileReport });
  }
}

if (totalFixed === 0) {
  console.log(`✓ 修复器跑完：${files.length} 个文件，无改动。`);
  process.exit(0);
}

console.log(`✓ 修复了 ${totalFixed} 处：\n`);
for (const { file, changes } of report) {
  console.log(`── ${file} ──`);
  for (const c of changes) {
    console.log(`  L${c.line}:`);
    console.log(`    - ${c.from}`);
    console.log(`    + ${c.to}`);
  }
  console.log('');
}