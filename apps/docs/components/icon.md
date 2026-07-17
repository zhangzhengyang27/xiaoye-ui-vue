# Icon 图标

语义化的矢量图形。使用图标组件，你需要安装 `@xiaoye-ui/icons` 图标组件包：

```bash
npm install --save @xiaoye-ui/icons
```

## 设计师专属

安装 [Kitchen Sketch 插件 💎](https://kitchen.alipay.com)，就可以一键拖拽使用 Xiaoye UI 和 Iconfont 的海量图标，还可以关联自有项目。

## 图标列表

:::demo 点击图标即可复制对应的组件标签。上方输入框支持按图标名搜索。

icon/all-icons

:::

## 基本用法

:::demo 通过 `@xiaoye-ui/icons` 引用 Icon 组件，不同主题的 Icon 组件名为图标名加主题做为后缀，也可以通过设置 `spin` 属性来实现动画旋转效果。

icon/basic

:::

## 自定义图标

:::demo 利用 `Icon` 组件封装一个可复用的自定义图标。可以通过 `component` 属性或插槽传入一个 `svg` 组件来渲染最终的图标，以满足特定的需求。

icon/custom

:::

## 使用 iconfont.cn

:::demo 对于使用 [iconfont.cn](http://iconfont.cn/) 的用户，通过设置 `createFromIconfontCN` 方法参数对象中的 `scriptUrl` 字段， 即可轻松地使用已有项目中的图标。

icon/iconfont

:::

## 多色图标

:::demo 双色图标可以通过 `two-tone-color` 属性设置主题色。

icon/two-tone

:::

## API

### 通用图标

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| rotate | 图标旋转角度（IE9 无效） | number | - |  |
| spin | 是否有旋转动画 | boolean | false |  |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - |  |
| twoToneColor | 仅适用双色图标。设置双色图标的主要颜色 | string (十六进制颜色) | - |  |

其中我们提供了三种主题的图标，不同主题的 Icon 组件名为图标名加主题做为后缀。

```jsx
import { StarOutlined, StarFilled, StarTwoTone } from '@xiaoye-ui/icons';

<star-outlined />
<star-filled />
<star-two-tone two-tone-color="#eb2f96" />
```

### 自定义 Icon/Custom Icon

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| component | 控制如何渲染图标，通常是一个渲染根标签为 `<svg>` 的 `Vue` 组件 | ComponentType&lt;CustomIconComponentProps> | - |  |
| rotate | 图标旋转角度（IE9 无效） | number | - |  |
| spin | 是否有旋转动画 | boolean | false |  |
| style | 设置图标的样式，例如 `fontSize` 和 `color` | CSSProperties | - |  |

### SVG 图标

在 `1.2.0` 之后，我们使用了 SVG 图标替换了原先的 font 图标，从而带来了以下优势：

- 完全离线化使用，不需要从 CDN 下载字体文件，图标不会因为网络问题呈现方块，也无需字体文件本地部署。
- 在低端设备上 SVG 有更好的清晰度。
- 支持多色图标。
- 对于内建图标的更换可以提供更多 API，而不需要进行样式覆盖。

更多讨论可参考：[#10353](#)。

所有的图标都会以 `<svg>` 标签渲染，可以使用 `style` 和 `class` 设置图标的大小和单色图标的颜色。例如：

```html
<template>
  <message-outlined :style="{fontSize: '16px', color: '#08c'}" />
</template>
<script>
  import { MessageOutlined } from '@xiaoye-ui/icons';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {
      MessageOutlined,
    },
  });
</script>
```

### 双色图标主色

对于双色图标，可以通过使用 `Icon.getTwoToneColor()` 和 `Icon.setTwoToneColor(colorString)` 来全局设置图标主色。

```jsx
import { getTwoToneColor, setTwoToneColor } from '@xiaoye-ui/icons';

setTwoToneColor('#eb2f96');
getTwoToneColor(); // #eb2f96
```

### 自定义 font 图标

在 `1.2.0` 之后，我们提供了一个 `createFromIconfontCN` 方法，方便开发者调用在 [iconfont.cn](http://iconfont.cn/) 上自行管理的图标。

```jsx
import { createFromIconfontCN } from '@xiaoye-ui/icons';
import { defineComponent } from 'vue';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js', // 在 iconfont.cn 上生成
});

export default defineComponent({
  setup() {
    return () => <MyIcon type="icon-dianzan" />;
  },
});
```

其本质上是创建了一个使用 `<use>` 标签来渲染图标的组件。

`options` 的配置项如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| extraCommonProps | 给所有的 `svg` 图标 `<Icon />` 组件设置额外的属性 | `{ class, attrs, props, on, style }` | \{\} |
| scriptUrl | [iconfont.cn](http://iconfont.cn/) 项目在线生成的 `js` 地址 | string | - |

在 `scriptUrl` 都设置有效的情况下，组件在渲染前会自动引入 [iconfont.cn](http://iconfont.cn/) 项目中的图标符号集，无需手动引入。

见 [iconfont.cn 使用帮助](http://iconfont.cn/help/detail?spm=a313x.7781069.1998910419.15&helptype=code) 查看如何生成 `js` 地址。

### 自定义 SVG 图标

#### vue cli 3

可以通过配置 [vue-svg-loader](https://www.npmjs.com/package/vue-svg-loader) 来将 `svg` 图标作为 `Vue` 组件导入。更多`vue-svg-loader` 的使用方式请参阅 [文档](https://github.com/visualfanatic/vue-svg-loader)。

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
};
```

```jsx
import { defineComponent } from 'vue';
import { Icon } from '@xiaoye-ui/icons';
import MessageSvg from 'path/to/message.svg'; // '*.svg' 文件的路径

export default defineComponent({
  setup() {
    return () => <Icon type={MessageSvg} />;
  },
});
```

#### Rsbuild

Rsbuild 是新一代构建工具，官网 https://rsbuild.dev/

自己实现一个 `vue-svg-loader.js` 文件，好处是可以自定义美化 svg，然后在 `rsbuild.config.ts` 中配置：

```js
// vue-svg-loader.js
/* eslint-disable */
const { optimize } = require('svgo');
const { version } = require('vue');
const semverMajor = require('semver/functions/major');

module.exports = async function (svg) {
  const callback = this.async();

  try {
    ({ data: svg } = await optimize(svg, {
      path: this.resourcePath,
      js2svg: {
        indent: 2,
        pretty: true,
      },
      plugins: [
        'convertStyleToAttrs',
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeStyleElement',
        'removeXMLNS',
        'removeXMLProcInst',
      ],
    }));
  } catch (error) {
    callback(error);
    return;
  }

  if (semverMajor(version) === 2) {
    svg = svg.replace('<svg', '<svg v-on="$listeners"');
  }

  callback(null, `<template>${svg}</template>`);
};
```

```js
// rsbuild.config.ts
/* eslint-disable */
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
  tools: {
    bundlerChain(chain, { CHAIN_ID }) {
      chain.module
        // 先给svg排除默认的规则，方便下面自定义loader
        .rule(CHAIN_ID.RULE.SVG)
        .exclude.add(/\.svg$/);
    },
    rspack: {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: ['vue-loader', 'vue-svg-loader'],
          },
        ],
      },
      resolveLoader: {
        alias: {
          'vue-svg-loader': require('path').join(__dirname, './vue-svg-loader.js'),
        },
      },
    },
  },
});
```

`Icon` 中的 `component` 组件的接受的属性如下：

| 字段   | 说明                    | 类型          | 只读值         |
| ------ | ----------------------- | ------------- | -------------- |
| class  | 计算后的 `svg` 类名     | string        | -              |
| fill   | `svg` 元素填充的颜色    | string        | 'currentColor' |
| height | `svg` 元素高度          | string \      | number         | '1em' |
| style  | 计算后的 `svg` 元素样式 | CSSProperties | -              |
| width  | `svg` 元素宽度          | string \      | number         | '1em' |
