import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { camelize } from '@vue/shared'

import type { MarkdownRenderer } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// .vitepress/plugins -> .vitepress -> docs
const docRoot = path.resolve(__dirname, '../..')

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?: MarkdownRenderer['renderer']['rules']['container']
}

function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (process.env.DEBUG_DEMO && tokens[idx].nesting === 1) {
        // eslint-disable-next-line no-console
        console.log('[demo-plugin] info:', m && m[1])
      }
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
            'utf-8'
          )
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        let jsSource
        try {
          jsSource = sfcTs2js(source)
        } catch (e: any) {
          throw new Error(
            `Error transforming source file ${sourceFile} to js: ${e}`
          )
        }
        const mdRender = (code: string) =>
          md.render(
            `\`\`\` vue\n${code}${code.endsWith('\n') ? '' : '\n'}\`\`\``
          )
        const encode = (code: string) =>
          encodeURIComponent(code).replace(/'/g, "\\'")
        const sources = `['${encode(mdRender(source))}', '${encode(mdRender(jsSource))}']`
        const rawSources = `['${encode(source)}', '${encode(jsSource)}']`
        // 将 button/basic 转换为 XyButtonBasic (PascalCase)，与 theme/index.ts 保持一致
        const componentName = 'Xy' + sourceFile
          .split('/')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')
        const res = `<Demo :sources="${sources}" path="${sourceFile}" :raw-sources="${rawSources}" description="${encodeURIComponent(md.render(description))}">
  <template #source><${componentName}/></template>`
        return res
      } else {
        return '</Demo>\n'
      }
    },
  }
}

export default createDemoContainer

function sfcTs2js(content: string): string {
  const scriptReg =
    /<script[\s\S]*?(?:lang="(ts|tsx)")[\s\S]*?>([\s\S]*?)<\/script>/
  const matched = content.match(scriptReg)
  if (matched && matched.index !== undefined) {
    const lang = matched[1]
    const jsLangAttr = lang === 'tsx' ? ' lang="jsx"' : ''
    const script = matched[2]
    const header = content.slice(0, matched.index)
    const footer = content.slice(matched.index + matched[0].length)
    return `${header}<script${jsLangAttr} setup>\n${ts2Js(script)}\n</script>${footer}`
  }
  return content
}

function ts2Js(content: string): string {
  const beforeTransformContent = content.replace(
    /\n(\s)*\n/g,
    '\n// blankline\n'
  )

  const result = tsTransform(beforeTransformContent)
  return result.trim().replace(/(\/\/ blankline(\n)?)+/g, '\n')
}

function tsTransform(code: string): string {
  const lines: string[] = []
  for (const line of code.split('\n')) {
    if (line.trim().startsWith('interface ') || line.trim().startsWith('type ')) {
      continue
    }

    const tsTypeMatch = line.match(/^(\s*)const (\w+): ([^=]+)=/)
    if (tsTypeMatch) {
      lines.push(`${tsTypeMatch[1]}const ${tsTypeMatch[2]} =`)
      continue
    }

    const tsFuncMatch = line.match(/^(\s*)function (\w+)\s*\(([^)]*)\):\s*([^{]+)\s*\{/)
    if (tsFuncMatch) {
      const indent = tsFuncMatch[1]
      const name = tsFuncMatch[2]
      const params = tsFuncMatch[3]
      const retType = tsFuncMatch[4]
      lines.push(`${indent}function ${name}(${params}) {`)
      continue
    }

    const arrowFuncMatch = line.match(/^(\s*)(\w+)\s*=\s*\(([^)]*)\)\s*:\s*([^{=>]+)\s*=>/)
    if (arrowFuncMatch) {
      const indent = arrowFuncMatch[1]
      const name = arrowFuncMatch[2]
      const params = arrowFuncMatch[3]
      lines.push(`${indent}const ${name} = (${params}) =>`)
      continue
    }

    const definePropMatch = line.match(/^(\s*)(\w+)\s*=\s*defineProp<([^>]+)>\(/ )
    if (definePropMatch) {
      const indent = definePropMatch[1]
      const name = definePropMatch[2]
      lines.push(`${indent}const ${name} = defineProp(`)
      continue
    }

    const genericMatch = line.match(/^(\s*)(\w+)<([^>]+)>/)
    if (genericMatch && !line.includes('import') && !line.includes('from')) {
      lines.push(line.replace(genericMatch[0], `${genericMatch[1]}${genericMatch[2]}`))
      continue
    }

    lines.push(line)
  }

  return lines.join('\n')
}
