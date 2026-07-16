#!/usr/bin/env node
/**
 * 文档迁移脚本
 * 将 xiaoye-ui 组件文档迁移到 VitePress 格式
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 组件分类映射
const componentCats = {
  // 通用
  'button': 'general', 'icon': 'general', 'typography': 'general', 'grid': 'general', 'space': 'general', 'flex': 'general',
  // 布局
  'affix': 'layout', 'breadcrumb': 'layout', 'drawer': 'layout', 'dropdown': 'layout', 'menu': 'layout', 'pagination': 'layout', 'steps': 'layout', 'tabs': 'layout', 'layout': 'layout',
  // 导航
  'anchor': 'navigation', 'app': 'navigation',
  // 数据录入
  'auto-complete': 'data-entry', 'cascader': 'data-entry', 'checkbox': 'data-entry', 'date-picker': 'data-entry', 'form': 'data-entry', 'input': 'data-entry', 'input-number': 'data-entry', 'mentions': 'data-entry', 'radio': 'data-entry', 'rate': 'data-entry', 'select': 'data-entry', 'slider': 'data-entry', 'switch': 'data-entry', 'time-picker': 'data-entry', 'transfer': 'data-entry', 'tree-select': 'data-entry', 'upload': 'data-entry',
  // 数据展示
  'avatar': 'data-display', 'badge': 'data-display', 'calendar': 'data-display', 'card': 'data-display', 'carousel': 'data-display', 'collapse': 'data-display', 'comment': 'data-display', 'descriptions': 'data-display', 'empty': 'data-display', 'image': 'data-display', 'list': 'data-display', 'popover': 'data-display', 'progress': 'data-display', 'qrcode': 'data-display', 'result': 'data-display', 'skeleton': 'data-display', 'statistic': 'data-display', 'table': 'data-display', 'tag': 'data-display', 'timeline': 'data-display', 'tooltip': 'data-display', 'tree': 'data-display', 'watermark': 'data-display',
  // 反馈
  'alert': 'feedback', 'message': 'feedback', 'modal': 'feedback', 'notification': 'feedback', 'popconfirm': 'feedback', 'spin': 'feedback', 'tour': 'feedback',
  // 其他
  'config-provider': 'other', 'divider': 'other', 'float-button': 'other', 'page-header': 'other', 'segmented': 'other',
}

// 源文档目录
const srcDir = path.join(__dirname, '../../packages/xiaoye-ui/src')
// 目标文档目录
const docsDir = path.join(__dirname, '..')

// 清理 Vue 语法
function cleanVueSyntax(content) {
  // 完全移除可能触发 Vue 编译的内容
  let result = content
  
  // 替换 a- 前缀标签
  result = result.replace(/<a-([a-z-]+)/g, '<span class="comp">$1')
  result = result.replace(/<\/a-([a-z-]+)>/g, '</span>')
  
  // 替换 v-model 等指令
  result = result.replace(/\(v-model\)/g, '(vmodel)')
  result = result.replace(/v-model=/g, 'vmodel=')
  
  // 替换所有 : 绑定
  result = result.replace(/:([a-z-]+)=/gi, '$1=')
  
  // 替换 @ 事件
  result = result.replace(/@([a-z-]+)=/g, 'on$1=')
  
  // 替换 v- 指令
  result = result.replace(/v-([a-z]+)=/g, '$1=')
  
  // 替换 HTML 属性中的 {{ }}
  result = result.replace(/\{\{([^}]+)\}\}/g, '&#123;&#123;$1&#125;&#125;')
  
  // 替换驼峰式组件标签 (ATable, AModal 等)
  result = result.replace(/<([A-Z][a-zA-Z]+)/g, '<span class="comp">$1')
  result = result.replace(/<\/([A-Z][a-zA-Z]+)>/g, '</span>')
  
  return result
}

// 提取 API 部分（从 ## API 开始到文件末尾）
function extractApi(content) {
  const apiIndex = content.indexOf('## API')
  if (apiIndex === -1) {
    // 没有 API 部分，返回开头内容
    const endOfFrontmatter = content.indexOf('---', 4)
    return content.substring(endOfFrontmatter + 1).trim()
  }
  return content.substring(apiIndex)
}

// 处理单个组件文档
function processComponent(compName) {
  const srcPath = path.join(srcDir, compName, 'index.zh-CN.md')
  const cat = componentCats[compName]
  
  if (!cat) {
    console.log(`⚠️  未分类: ${compName}`)
    return
  }
  
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  不存在: ${srcPath}`)
    return
  }
  
  let content = fs.readFileSync(srcPath, 'utf-8')
  
  // 移除 ::: demo 代码块（保留 API 文档）
  content = content.replace(/::: demo[\s\S]*?:::/g, '')
  
  // 清理 Vue 语法
  content = cleanVueSyntax(content)
  
  // 提取 API 部分
  content = extractApi(content)
  
  // 写入目标文件
  const dstPath = path.join(docsDir, cat, `${compName}.md`)
  fs.writeFileSync(dstPath, content)
  console.log(`✅ ${compName} -> ${cat}/`)
}

// 主函数
function main() {
  console.log('开始迁移文档...\n')
  
  // 遍历源目录中的所有组件
  if (!fs.existsSync(srcDir)) {
    console.error(`源目录不存在: ${srcDir}`)
    process.exit(1)
  }
  
  const components = fs.readdirSync(srcDir).filter(name => {
    return fs.statSync(path.join(srcDir, name)).isDirectory()
  })
  
  for (const comp of components) {
    processComponent(comp)
  }
  
  console.log('\n迁移完成！')
  
  // 统计
  const categories = ['general', 'layout', 'navigation', 'data-entry', 'data-display', 'feedback', 'other']
  console.log('\n统计:')
  for (const cat of categories) {
    const catPath = path.join(docsDir, cat)
    if (fs.existsSync(catPath)) {
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.md'))
      console.log(`  ${cat}: ${files.length} 个组件`)
    }
  }
}

main()
