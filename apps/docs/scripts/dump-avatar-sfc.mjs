import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import fs from 'fs'
import path from 'path'

const demoPlugin = (await import('/Users/xiaoye/Desktop/ant-design-vue-main/apps/docs/.vitepress/plugins/demo.ts')).default

const md = MarkdownIt({ html: false, linkify: true })
container(md, 'demo', demoPlugin(md))

const input = fs.readFileSync('/Users/xiaoye/Desktop/ant-design-vue-main/apps/docs/components/avatar.md', 'utf-8')
const html = md.render(input)

// Simulate vitepress wrapping
const sfc = `<template><div>${html}</div></template>`

// Try to parse with vue compiler
const { parse, compileTemplate } = await import('@vue/compiler-sfc')

try {
  const { descriptor } = parse(sfc, { filename: 'avatar.md' })
  console.log('parse OK')
  if (descriptor.template) {
    const result = compileTemplate({
      source: descriptor.template.content,
      filename: 'avatar.md',
      id: 'avatar'
    })
    console.log('compileTemplate OK')
  }
} catch (e) {
  console.error('Error:', e.message)
  console.error('Loc:', JSON.stringify(e.loc))
  if (e.loc) {
    const lines = sfc.split('\n')
    const start = Math.max(0, e.loc.start.line - 3)
    const end = Math.min(lines.length, e.loc.start.line + 3)
    for (let i = start; i < end; i++) {
      console.log(`${i + 1}: ${lines[i]}`)
    }
  }
}

fs.writeFileSync('/tmp/dump-avatar-sfc.txt', sfc)
console.log('SFC lines:', sfc.split('\n').length)