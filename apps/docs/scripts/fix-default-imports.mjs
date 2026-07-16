#!/usr/bin/env node
/**
 * 把 demo 文件中 `import { message } from 'xiaoye-ui'` 改成
 * `import message from 'xiaoye-ui/message'`。
 * 因为 message/notification 是默认导出，不能用具名导入。
 * 处理多具名导入：`{ A, message, B }` -> `import message from 'xiaoye-ui/message'\nimport { A, B } from 'xiaoye-ui'`
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const examplesDir = path.join(__dirname, '../examples')

const NAMED = ['message', 'notification']

let updated = 0
const visit = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      visit(fp)
    } else if (entry.name.endsWith('.vue') || entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(fp, 'utf-8')
      const before = content
      for (const n of NAMED) {
        // 匹配 `import { ...n... } from 'xiaoye-ui'`
        const r = new RegExp(
          `import\\s*\\{([^{}]*?)\\b${n}\\b([^{}]*?)\\}\\s*from\\s*['"]xiaoye-ui['"]`,
          'g'
        )
        content = content.replace(r, (m, before2, after2) => {
          const others = (before2 + after2)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
          const defaultImport = `import ${n} from 'xiaoye-ui/${n}'`
          if (others.length === 0) {
            return defaultImport
          }
          return defaultImport + `\nimport { ${others.join(', ')} } from 'xiaoye-ui'`
        })
      }
      if (content !== before) {
        fs.writeFileSync(fp, content)
        updated++
        console.log('✓', path.relative(examplesDir, fp))
      }
    }
  }
}

visit(examplesDir)
console.log(`\nDone. ${updated} file(s) updated.`)