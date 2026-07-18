# BackTop 回到顶部

返回页面顶部的操作按钮。

## 何时使用

- 当页面内容区域较长，用户需要快速返回顶部查看内容时使用；
- 常用于内容密集型页面、长列表、文档站点等场景；
- 提供全局的快捷导航能力，提升长页面的浏览体验。

## 基础用法

:::demo 最简单的用法，滚动页面超过默认高度（400px）后出现回到顶部按钮。

back-top/basic

:::

## 自定义显示高度

:::demo 通过 `visibilityHeight` 设置按钮出现所需的滚动高度，数值越小越早出现。

back-top/visibility-height

:::

## 自定义滚动容器

:::demo 通过 `target` 设置需要监听其滚动事件的元素，按钮会基于该容器的滚动位置进行显示与回到顶部操作。

back-top/custom-target

:::

## 自定义内容

:::demo 通过默认插槽自定义按钮的渲染内容。

back-top/custom-icon

:::

## 自定义显示高度

:::demo 滚动超过 200px 才显示按钮。

back-top/custom-visibility-height

:::

## 自定义按钮

:::demo 用 default slot 自定义按钮内容。

back-top/custom-button

:::

## 与 Affix 组合

:::demo affix 固定工具栏，back-top 回到顶部。

back-top/with-affix

:::

## API

> 自 `xiaoye-ui@1.0.0` 版本开始提供该组件。

### BackTop

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| visibilityHeight | 滚动高度达到此参数值才出现 BackTop | number | 400 |  |
| target | 设置需要监听其滚动事件的元素 | () => HTMLElement \| Window \| Document | () => window |  |
| duration | 回到顶部所需时间（毫秒） | number | 450 |  |
| onClick | 点击按钮的回调函数 | (event: MouseEvent) => void | - |  |

### BackTop 事件

| 事件名称 | 说明             | 回调参数                    | 版本 |
| -------- | ---------------- | --------------------------- | ---- |
| click    | 点击按钮时的回调 | (event: MouseEvent) => void | -    |

### BackTop 插槽

| 插槽名  | 说明             | 版本 |
| ------- | ---------------- | ---- |
| default | 自定义按钮的内容 | -    |
