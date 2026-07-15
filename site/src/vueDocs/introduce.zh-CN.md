# Xiaoye UI

Xiaoye UI 是一个基于 Vue 的企业级组件库，开发和服务于企业级后台产品。

<div class="pic-plus">
  <img width="150" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <span>+</span>
  <img width="160" src="https://www.xiaoye-ui.github.io/vue.png" />
</div>

<style>
.pic-plus > * {
  display: inline-block !important;
  vertical-align: middle;
}
.pic-plus span {
  font-size: 30px;
  color: #aaa;
  margin: 0 20px;
}
</style>

## 特性

- 提炼自企业级中后台产品的交互语言和视觉风格。
- 开箱即用的高质量 Vue 组件。

## 支持环境

- 现代浏览器, 如果需要支持 IE9，你可以选择使用 [1.x 版本](https://1x.xiaoye-ui.github.io/)。
- 支持服务端渲染。
- [Electron](https://electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Electron |
| --- | --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 版本

- 稳定版：[![npm package](https://img.shields.io/npm/v/xiaoye-ui.svg?style=flat-square)](https://www.npmjs.org/package/xiaoye-ui)

你可以订阅：<https://github.com/xiaoye-ui/xiaoye-ui/releases.atom> 来获得稳定版发布的通知。

## 安装

### 使用 npm 或 yarn 安装

**我们推荐使用 npm 或 yarn 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

```bash
$ npm install xiaoye-ui@4.x --save
```

```bash
$ yarn add xiaoye-ui@4.x
```

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antd`。

我们在 npm 发布包内的 `xiaoye-ui/dist` 目录下提供了 `antd.js`、`antd.min.js` 和 `reset.css`。你也可以通过 [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/xiaoye-ui/badge)](https://www.jsdelivr.com/package/npm/xiaoye-ui) 或 [UNPKG](https://unpkg.com/xiaoye-ui/dist/) 进行下载。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：引入 `antd.js` 前你需要自行引入 `vue`、[`dayjs`](https://day.js.org/) 及其相关插件。

如：

```html
<script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
<script src="https://unpkg.com/dayjs/plugin/customParseFormat.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekday.js"></script>
<script src="https://unpkg.com/dayjs/plugin/localeData.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekOfYear.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekYear.js"></script>
<script src="https://unpkg.com/dayjs/plugin/advancedFormat.js"></script>
<script src="https://unpkg.com/dayjs/plugin/quarterOfYear.js"></script>
```

## 示例

```jsx
import { DatePicker } from 'xiaoye-ui';
app.use(DatePicker);
```

引入样式：

```jsx
import 'xiaoye-ui/dist/reset.css';
```

### 按需加载

`xiaoye-ui` 默认支持基于 ES modules 的 tree shaking。

### 自动按需引入组件

#### [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)

如果你使用的是 `Vite` ，我们推荐使用 `unplugin-vue-components`

```bash
$ npm install unplugin-vue-components -D
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { XiaoyeUIResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
  plugins: [
    // ...
    Components({
      resolvers: [
        XiaoyeUIResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
});
```

然后你可以在代码中直接引入 `xiaoye-ui` 的组件，插件会自动将代码转化为 `import { Button } from 'xiaoye-ui'` 的形式。

```jsx
import { Button } from 'xiaoye-ui';
```

## 链接

- [首页](https://www.xiaoye-ui.github.io/)
- [组件库](https://www.xiaoye-ui.github.io/components/overview-cn)
- [更新日志](/docs/vue/changelog-cn)
- [CodeSandbox 模板](https://codesandbox.io/s/agitated-franklin-1w72v) for bug reports
- [定制主题](/docs/vue/customize-theme-cn)
- [常见问题](/docs/vue/faq-cn)
- [支持我们](/docs/vue/sponsor-cn)
- [Awesome Xiaoye UI](https://github.com/xiaoye-ui/xiaoye-ui-awesome)

## 如何贡献

如果你希望参与贡献，欢迎 [Pull Request](https://github.com/xiaoye-ui/xiaoye-ui/pulls)，或给我们 [报告 Bug](https://xiaoye-ui.github.io/issue-helper/)([国内镜像](http://xiaoye-ui.gitee.io/issue-helper/))。

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

## 关于 xiaoye-ui

Xiaoye UI 是一套企业级 UI 设计语言和 Vue 实现，为开发者提供丰富的组件和示例，用于构建交互丰富的用户界面。

Xiaoye UI 提供了一套完整的组件库，具有一致的样式和 API 设计。组件基于 Vue 3 构建，专为企业级应用而设计。

Xiaoye UI 致力于提供给程序员**愉悦**的开发体验。

## 特别感谢

Xiaoye UI Team
