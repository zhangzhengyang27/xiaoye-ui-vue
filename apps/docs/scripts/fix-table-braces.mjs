#!/usr/bin/env node
/**
 * 一次性修复脚本：把 components/<comp>.md 里表格中未转义的 `{`/`}` 转义掉。
 * 解决 markdown 表格里的 `{ foo: bar }` 被当作 HTML 标签属性，
 * 进而引发 [plugin vite:vue] Duplicate attribute 错误的问题。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.join(__dirname, '../components')

function escapeBracesInTables(md) {
  const lines = md.split('\n')
  let inFence = false
  const out = []
  for (const raw of lines) {
    const line = raw
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence) {
      out.push(line)
      continue
    }
    if (!/\|/.test(line)) {
      out.push(line)
      continue
    }
    if (/^\s*\|?\s*:?-{2,}/.test(line.trim())) {
      out.push(line)
      continue
    }
    const trimmed = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '')
    const cells = trimmed.split('|').map(c => c)
    const newCells = cells.map(cell => {
      let result = ''
      let i = 0
      let inBacktick = false
      while (i < cell.length) {
        const ch = cell[i]
        if (ch === '\\' && i + 1 < cell.length && (cell[i + 1] === '{' || cell[i + 1] === '}')) {
          result += cell.slice(i, i + 2)
          i += 2
          continue
        }
        if (ch === '`') {
          inBacktick = !inBacktick
          result += ch
          i += 1
          continue
        }
        if (!inBacktick && (ch === '{' || ch === '}')) {
          result += '\\' + ch
          i += 1
          continue
        }
        result += ch
        i += 1
      }
      return result
    })
    out.push('| ' + newCells.join(' | ') + ' |')
  }
  return out.join('\n')
}

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.md'))
let updated = 0
for (const f of files) {
  const fp = path.join(componentsDir, f)
  const before = fs.readFileSync(fp, 'utf-8')
  const after = escapeBracesInTables(before)
  if (after !== before) {
    fs.writeFileSync(fp, after)
    updated++
    console.log('✓ fixed', f)
  }
}
console.log(`\nDone. ${updated} file(s) updated.`)