#!/usr/bin/env node
/**
 * 修复 markdown 表格语法（dry-run）：只报告，不改文件
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

function splitCells(row) {
  let s = row.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
  return s.split('|');
}

function normalizeRow(row, expectedCols) {
  const cells = splitCells(row);
  if (cells.length === expectedCols) return null;

  if (cells.length > expectedCols) {
    if (cells.length === expectedCols + 1 && cells[cells.length - 1].trim() === '') {
      return '| ' + cells.slice(0, expectedCols).map(c => c.trim()).join(' | ') + ' |';
    }
    const midEnd = cells.length - (expectedCols - 2);
    const head = cells.slice(0, 2);
    const midRaw = cells.slice(2, midEnd).join('|');
    const midEscaped = midRaw.replace(/\|/g, '\\|');
    const tail = cells.slice(midEnd);
    const merged = [...head, midEscaped, ...tail];
    if (merged.length === expectedCols) {
      return '| ' + merged.map(c => c.trim()).join(' | ') + ' |';
    }
    const head2 = cells.slice(0, expectedCols - 1);
    const tailRaw2 = cells.slice(expectedCols - 1).join('|');
    const tailEscaped2 = tailRaw2.replace(/\|/g, '\\|');
    return '| ' + [...head2, tailEscaped2].map(c => c.trim()).join(' | ') + ' |';
  } else {
    while (cells.length < expectedCols) cells.push('');
    return '| ' + cells.map(c => c.trim()).join(' | ') + ' |';
  }
}

let totalChanges = 0;
const report = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const fileReport = [];

  let i = 0;
  while (i < lines.length - 1) {
    const header = lines[i];
    const sep = lines[i + 1];
    const hOK = /^\s*\|.*\|\s*$/.test(header);
    const sOK = SEP_RE.test(sep);
    if (!(hOK && sOK)) { i++; continue; }

    const expected = splitCells(header).length;

    const sepCells = splitCells(sep);
    if (sepCells.length !== expected) {
      const cells = Array(expected).fill('---');
      const fixed = '| ' + cells.join(' | ') + ' |';
      fileReport.push({ line: i + 2, from: sep, to: fixed });
    }

    let j = i + 2;
    while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j]) && !SEP_RE.test(lines[j])) {
      const bodyCells = splitCells(lines[j]);
      if (bodyCells.length !== expected) {
        const fixed = normalizeRow(lines[j], expected);
        fileReport.push({ line: j + 1, from: lines[j], to: fixed });
      }
      j++;
    }
    i = j;
  }

  if (fileReport.length) {
    report.push({ file, changes: fileReport });
    totalChanges += fileReport.length;
  }
}

if (totalChanges === 0) {
  console.log(`✓ Dry-run：${files.length} 个文件，无问题。`);
  process.exit(0);
}

console.log(`✓ Dry-run：计划修改 ${totalChanges} 处（${report.length} 个文件）：\n`);
for (const { file, changes } of report) {
  console.log(`── ${file} ──`);
  for (const c of changes) {
    console.log(`  L${c.line}:`);
    console.log(`    - ${c.from}`);
    console.log(`    + ${c.to}`);
  }
  console.log('');
}