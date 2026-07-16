// 样式引入顺序参考 element-plus 文档站
// 1. normalize.css - 浏览器默认样式归一
import 'normalize.css'
// 2. el-vars.scss - 定义 --el-* CSS 变量为 XiaoyeUI 默认值
import './styles/el-vars.scss'
// 3. css-vars.scss - 文档站变量引用 --el-* 变量
import './styles/css-vars.scss'
// 4. app.scss - 文档站样式总入口（含 base/code/navbar/sidebar/content 等）
import './styles/app.scss'

import VPDemo from './components/vp-demo.vue'

export const globals = {
  Demo: VPDemo,
}

export { default } from './components/vp-app.vue'
