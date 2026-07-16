import { defineConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import markdownContainer from 'markdown-it-container'
import createDemoContainer from '../plugins/demo'
import { MarkdownTransform } from '../plugins/markdown-transform'
import vueTypeStubs from '../plugins/vue-type-stubs'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// docs lives at apps/docs, so the monorepo root is two levels up from process.cwd()
const repoRoot = path.resolve(process.cwd(), '../..')
const xiaoyeUiPkg = path.resolve(repoRoot, 'packages/xiaoye-ui/package.json')
const xiaoyeUiAlias = path.resolve(repoRoot, 'packages/xiaoye-ui/src/index.ts')
const xiaoyeUiCoreAlias = path.resolve(repoRoot, 'packages/core/src/index.ts')
const xiaoyeUiIconsAlias = path.resolve(repoRoot, 'packages/icons/src/index.js')
const xiaoyeUiUtilsAlias = path.resolve(repoRoot, 'packages/utils/src/index.ts')
const xiaoyeUiSrc = path.resolve(repoRoot, 'packages/xiaoye-ui/src')
const xiaoyeUiCoreSrc = path.resolve(repoRoot, 'packages/core/src')
const xiaoyeUiIconsSrc = path.resolve(repoRoot, 'packages/icons/src')
const xiaoyeUiUtilsSrc = path.resolve(repoRoot, 'packages/utils/src')

if (!fs.existsSync(xiaoyeUiPkg)) {
  throw new Error(`Cannot find local xiaoye-ui package at ${xiaoyeUiPkg}`)
}

// 组件统一放在 /components/<name> 下，sidebar 按组件所属分类分组，
// 并通过自定义 matchRoute 把所有 /components/* 路径都映射到 7 个分类组。
const categories = [
  { name: 'general', label: '通用', components: ['button', 'icon', 'typography', 'grid', 'space', 'flex'] },
  { name: 'layout', label: '布局', components: ['affix', 'breadcrumb', 'drawer', 'dropdown', 'menu', 'pagination', 'steps', 'tabs', 'layout'] },
  { name: 'navigation', label: '导航', components: ['anchor', 'app'] },
  { name: 'data-entry', label: '数据录入', components: ['auto-complete', 'cascader', 'checkbox', 'date-picker', 'form', 'input', 'input-number', 'mentions', 'radio', 'rate', 'select', 'slider', 'switch', 'time-picker', 'transfer', 'tree-select', 'upload'] },
  { name: 'data-display', label: '数据展示', components: ['avatar', 'badge', 'calendar', 'card', 'carousel', 'collapse', 'comment', 'descriptions', 'empty', 'image', 'list', 'popover', 'progress', 'qrcode', 'result', 'skeleton', 'statistic', 'table', 'tag', 'timeline', 'tooltip', 'tree', 'watermark'] },
  { name: 'feedback', label: '反馈', components: ['alert', 'message', 'modal', 'notification', 'popconfirm', 'spin', 'tour'] },
  { name: 'other', label: '其他', components: ['config-provider', 'divider', 'float-button', 'page-header', 'segmented'] },
]

function componentLink(name: string) {
  return `/components/${name}`
}

function getSidebar() {
  const sidebar: Record<string, any> = {
    '/components/': categories.map(cat => ({
      text: cat.label,
      collapsed: false,
      items: cat.components.map(name => ({
        text: name,
        link: componentLink(name),
      })),
    })),
  }
  return sidebar
}

export default defineConfig({
  title: 'XiaoyeUI',
  description: 'Vue UI 组件库',
  lang: 'zh-CN',
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'XiaoyeUI',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/button' },
      { text: 'GitHub', link: 'https://github.com/xiaoye-ui/xiaoye-ui' }
    ],
    sidebar: {
      '/guide/': [{ text: '指南', items: [{ text: '介绍', link: '/guide/' }, { text: '安装', link: '/guide/installation' }] }],
      ...getSidebar()
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xiaoye-ui/xiaoye-ui' }],
    footer: { message: 'MIT License', copyright: 'Copyright © 2024 xiaoye-ui' }
  },
  vite: {
    resolve: {
      alias: [
        { find: /^~\//, replacement: path.resolve(__dirname, './vitepress/') + '/' },
        { find: /^@examples\//, replacement: path.resolve(__dirname, '../examples/') + '/' },
        // 把 monorepo 里的本地 xiaoye-ui 系列包强制指向源码（覆盖 npm 上的 5.x 旧版本）
        { find: /^xiaoye-ui$/, replacement: xiaoyeUiAlias },
        { find: /^xiaoye-ui\/(.+)$/, replacement: `${xiaoyeUiSrc}/$1` },
        { find: /^@xiaoye-ui\/core$/, replacement: xiaoyeUiCoreAlias },
        { find: /^@xiaoye-ui\/core\/(.+)$/, replacement: `${xiaoyeUiCoreSrc}/$1` },
        { find: /^@xiaoye-ui\/icons$/, replacement: xiaoyeUiIconsAlias },
        { find: /^@xiaoye-ui\/icons\/(.+)$/, replacement: `${xiaoyeUiIconsSrc}/$1` },
        { find: /^@xiaoye-ui\/utils$/, replacement: xiaoyeUiUtilsAlias },
        { find: /^@xiaoye-ui\/utils\/(.+)$/, replacement: `${xiaoyeUiUtilsSrc}/$1` },
      ],
    },
    plugins: [
      tailwindcss(),
      vueJsx(),
      Components({
        // 只扫描 .vitepress/vitepress/components 目录
        // examples 目录下的 demo 组件已在 theme/index.ts 中通过显式 import 注册
        // 这样可以避免 unplugin-vue-components 将同名文件注册为相同组件名（如多个 basic.vue -> Basic）
        dirs: ['.vitepress/vitepress/components'],
        // 注意：不要把 'md' 加进 extensions，否则当组件解析失败时 unplugin 会回退去
        // import '<path>.md?import'，vitepress dev 会把这种不存在的 .md 请求 fallback
        // 到 SPA index.html，触发 "Failed to resolve module specifier '.md?import'"
        // (MIME text/html) 错误。我们已经通过 theme/index.ts 显式注册了所有 demo 组件。
        include: [/\.vue\?vue/, /\.vue$/],
        extensions: ['vue'],
        dts: false,
      }),
      Icons({
        autoInstall: true,
      }),
      MarkdownTransform(),
      vueTypeStubs(),
    ],
    ssr: {
      noExternal: ['xiaoye-ui', '@xiaoye-ui', /^@xiaoye-ui\//, 'ant-design-vue', '@ant-design/icons-vue'],
    },
  },
  markdown: {
    config(md) {
      md.use(markdownContainer, 'demo', createDemoContainer(md))
    },
  },
})
