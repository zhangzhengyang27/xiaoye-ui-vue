#!/usr/bin/env node
/**
 * 迁移 xiaoye-ui 组件演示到 apps/docs/examples，并更新 docs/components/*.md
 * 同时删除 packages/xiaoye-ui/src 下所有 .md 文件和 demo/index.vue
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, '../../../')
const sourceDir = path.join(repoRoot, 'packages/xiaoye-ui/src')
const targetExamplesDir = path.join(repoRoot, 'apps/docs/examples')
const targetComponentsDir = path.join(repoRoot, 'apps/docs/components')

const log = (...args) => console.log(...args)
const warn = (...args) => console.warn(...args)

/**
 * Strip the leading `<docs>...</docs>` block from a demo vue file.
 */
function stripDocsBlock(content) {
  const docsRegex = /^<docs>[\s\S]*?<\/docs>\s*/
  return content.replace(docsRegex, '')
}

/**
 * Parse the frontmatter / docs header to extract order, title.zh-CN and description.zh-CN.
 * Returns null when the file does not have a docs block.
 */
function parseDemoDocs(content) {
  const blockMatch = content.match(/^<docs>\s*---\n([\s\S]*?)\n---\n([\s\S]*?)<\/docs>/)
  if (!blockMatch) return null

  const frontmatter = blockMatch[1]
  const body = blockMatch[2]

  // line-by-line parse to handle nested yaml
  const lines = frontmatter.split('\n')
  const get = (key) => {
    const re = new RegExp(`^${key}\\s*:\\s*(.+)$`)
    for (const line of lines) {
      const m = line.match(re)
      if (m) return m[1].trim().replace(/^["']|["']$/g, '')
    }
    return undefined
  }
  const getNested = (key, sub) => {
    let mode = null
    for (const line of lines) {
      if (mode === null && new RegExp(`^${key}\\s*:`).test(line)) {
        mode = key
        continue
      }
      if (mode === key) {
        const m = line.match(new RegExp(`^\\s*${sub}\\s*:\\s*(.+)$`))
        if (m) {
          let v = m[1].trim()
          v = v.replace(/^["']|["']$/g, '')
          return v
        }
        if (/^\S/.test(line) && !line.startsWith(' ') && !line.startsWith('\t')) {
          mode = null
        }
      }
    }
    return undefined
  }

  const order = Number(get('order') ?? '0')
  const title = getNested('title', 'zh-CN') || `演示 ${order}`
  // extract zh-CN body, normalize to single line by replacing newlines with space
  const descBody = body.match(/##\s*zh-CN\s*\n+([\s\S]*?)(?:\n##\s*en-US|$)/)
  let description = descBody ? descBody[1].trim() : ''
  description = description.replace(/\s*\n\s*/g, ' ')

  return { order, title, description }
}

/**
 * Parse the index.zh-CN.md frontmatter to extract category, subtitle, title.
 */
function parseIndexFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return null
  const fm = m[1]
  const lines = fm.split('\n')
  const get = (key) => {
    const re = new RegExp(`^${key}\\s*:\\s*(.+)$`)
    for (const line of lines) {
      const match = line.match(re)
      if (match) return match[1].trim().replace(/^["']|["']$/g, '')
    }
    return undefined
  }
  return {
    category: get('category'),
    type: get('type'),
    title: get('title'),
    subtitle: get('subtitle'),
    cover: get('cover'),
    coverDark: get('coverDark'),
  }
}

/**
 * Extract the `## API` section from an md, including everything to end of file.
 * If no `## API` exists, returns empty string.
 */
function extractApiSection(content) {
  const apiIdx = content.indexOf('\n## API')
  if (apiIdx === -1) return ''
  return content.slice(apiIdx).trim() + '\n'
}

/**
 * Extract content after frontmatter but before `## API` (e.g. 何时使用 section).
 */
function extractIntro(content) {
  const fmEnd = content.indexOf('\n---\n')
  if (fmEnd === -1) return ''
  let after = content.slice(fmEnd + 5)
  const apiIdx = after.indexOf('## API')
  if (apiIdx >= 0) after = after.slice(0, apiIdx)
  return after.trim()
}

/**
 * Build the docs/components/<comp>.md content.
 */
function buildDocsMd({
  title,
  subtitle,
  intro,
  demos,
  api,
}) {
  const out = []
  out.push(`# ${title} ${subtitle}`)
  out.push('')
  if (intro) {
    out.push(intro)
    out.push('')
  }
  // demos sections (already ordered)
  for (const demo of demos) {
    out.push(`## ${demo.title}`)
    out.push('')
    if (demo.description) {
      out.push(`:::demo ${demo.description}`)
    } else {
      out.push(':::demo')
    }
    out.push('')
    out.push(`${demo.path}`)
    out.push('')
    out.push(':::')
    out.push('')
  }
  // api section (already starts with '## API')
  if (api) {
    out.push(escapeBracesInTables(api).trim())
    out.push('')
  }
  return out.join('\n')
}

/**
 * 在 markdown 表格行内，把不在反引号 / 已转义 / code fence 里的 `{` `}` 转义，
 * 防止它们被 html parser 当成标签边界，导致 [plugin vite:vue] Duplicate attribute。
 *
 * 例如 `{ xs: number, sm: number, ...}` 在表格单元格里会被解析成 `<xs:="" number,="" sm:="" number,="" css-module=".">`，
 * 进而引发 SFC parse 失败。这里统一包到反引号里 `` `{ ... }` ``，更安全也更易读。
 */
function escapeBracesInTables(md) {
  const lines = md.split('\n')
  let inFence = false
  const out = []
  for (const raw of lines) {
    const line = raw
    // 跟踪 fenced code block
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence) {
      out.push(line)
      continue
    }
    // 只处理表格行（以 `|` 开头或包含 ` | `）
    if (!/\|/.test(line)) {
      out.push(line)
      continue
    }
    // 分隔行 `| --- | --- |` 跳过
    if (/^\s*\|?\s*:?-{2,}/.test(line.trim())) {
      out.push(line)
      continue
    }
    // 拆分单元格，逐个处理
    // 去掉首尾的 | 然后按 | 切分
    const trimmed = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '')
    const cells = trimmed.split('|').map(c => c)
    const newCells = cells.map(cell => {
      // 跳过已包含完整反引号代码段（简单状态机）
      let result = ''
      let i = 0
      let inBacktick = false
      while (i < cell.length) {
        const ch = cell[i]
        if (ch === '\\' && i + 1 < cell.length && (cell[i + 1] === '{' || cell[i + 1] === '}')) {
          // 已经转义，直接保留
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

/**
 * Process a single component folder.
 */
function processComponent(compName) {
  const compDir = path.join(sourceDir, compName)
  const demoDir = path.join(compDir, 'demo')
  const targetCompExampleDir = path.join(targetExamplesDir, compName)
  const targetDocPath = path.join(targetComponentsDir, `${compName}.md`)

  const indexZhPath = path.join(compDir, 'index.zh-CN.md')
  if (!fs.existsSync(indexZhPath)) {
    // 没有 zh-CN 文档的组件直接跳过
    return null
  }
  const zhContent = fs.readFileSync(indexZhPath, 'utf-8')
  const fm = parseIndexFrontmatter(zhContent)
  const intro = extractIntro(zhContent)
  const api = extractApiSection(zhContent)

  // gather demos
  const demos = []
  if (fs.existsSync(demoDir)) {
    const demoFiles = fs.readdirSync(demoDir).filter(f => f.endsWith('.vue'))
    for (const demoFile of demoFiles) {
      if (demoFile === 'index.vue') continue
      const demoPath = path.join(demoDir, demoFile)
      const demoContent = fs.readFileSync(demoPath, 'utf-8')
      const meta = parseDemoDocs(demoContent)
      const demoName = demoFile.replace(/\.vue$/, '')
      demos.push({
        order: meta?.order ?? 999,
        title: meta?.title ?? demoName,
        description: meta?.description ?? '',
        name: demoName,
        path: `${compName}/${demoName}`,
      })

      // write to target (strip docs block)
      fs.mkdirSync(targetCompExampleDir, { recursive: true })
      const stripped = stripDocsBlock(demoContent)
      const targetExamplePath = path.join(targetCompExampleDir, demoFile)
      fs.writeFileSync(targetExamplePath, stripped)
    }
  }
  demos.sort((a, b) => a.order - b.order)

  // build docs/components/<comp>.md
  const docBody = buildDocsMd({
    title: fm?.title ?? compName,
    subtitle: fm?.subtitle ?? '',
    intro,
    demos,
    api,
  })
  fs.mkdirSync(targetComponentsDir, { recursive: true })
  fs.writeFileSync(targetDocPath, docBody)

  return {
    compName,
    demoCount: demos.length,
    docWritten: true,
    examplesDir: targetCompExampleDir,
  }
}

function main() {
  log('🚀 开始迁移组件演示与文档...\n')

  const components = fs.readdirSync(sourceDir).filter(name => {
    const p = path.join(sourceDir, name)
    return fs.statSync(p).isDirectory()
  })

  const results = []
  for (const comp of components) {
    const r = processComponent(comp)
    if (r) results.push(r)
  }

  log(`\n✅ 处理完成，共 ${results.length} 个组件`)
  for (const r of results) {
    log(`  - ${r.compName}: ${r.demoCount} 个 example，文档已写入 components/${r.compName}.md`)
  }
}

main()
