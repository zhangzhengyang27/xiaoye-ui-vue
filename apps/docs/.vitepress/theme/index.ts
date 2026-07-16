import DefaultTheme from 'vitepress/theme'
import { globals } from '../vitepress'
import XiaoyeUI from 'xiaoye-ui'
import { camelize } from '@vue/shared'
import '../styles/tailwind.css'
import './custom.css'

// Example components: 基于 examples/ 目录自动注册 Xy<Component><Demo> 与 xy-<comp>-<demo>
// docs/.vitepress/plugins/markdown-transform.ts 会为 *.md 注入
// import Xy<Comp><Demo> from '/examples/<comp>/<demo>.vue'
// docs/.vitepress/plugins/demo.ts 则在 :::demo 容器里渲染 <xy-<comp>-<demo>/>。
const exampleModules = import.meta.glob('/examples/**/!(*index).vue', { eager: true })

const exampleComponents = Object.fromEntries(
  Object.entries(exampleModules).map(([path, mod]) => {
    // path: /examples/<comp>/<demo>.vue
    const segments = path.split('/').filter(Boolean)
    const component = segments[1]
    const demoFile = segments[segments.length - 1].replace(/\.vue$/, '')
    const camel = camelize(`Xy-${component}-${demoFile}`)
    return [camel, (mod as any).default]
  })
)

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(XiaoyeUI)
    Object.entries(globals).forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
    Object.entries(exampleComponents).forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
}
