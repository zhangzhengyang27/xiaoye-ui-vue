# Flex 弹性布局

## 何时使用

- 适合设置元素之间的间距。
- 适合设置各种水平、垂直对齐方式。

### 与 Space 组件的区别

- Space 为内联元素提供间距，其本身会为每一个子元素添加包裹元素用于内联对齐。适用于行、列中多个子元素的等距排列。
- Flex 为块级元素提供间距，其本身不会添加包裹元素。适用于垂直或水平方向上的子元素布局，并提供了更多的灵活性和控制能力。

## 基本布局

:::demo 最简单的用法。

flex/basic

:::

## 对齐方式

:::demo 设置对齐方式。

flex/align

:::

## 设置间隙

:::demo 使用 `gap` 设置元素之间的间距，预设了 `small`、`middle`、`large` 三种尺寸，也可以自定义间距。

flex/gap

:::

## 自动换行

:::demo 自动换行。

flex/wrap

:::

## 组合使用

:::demo 嵌套使用，可以实现更复杂的布局。

flex/combination

:::

## API

> 自 `xiaoye-ui@1.0.0` 版本开始提供该组件。Flex 组件默认行为在水平模式下，为向上对齐，在垂直模式下，为拉伸对齐，你可以通过属性进行调整。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| vertical | flex 主轴的方向是否垂直，使用 `flex-direction: column` | boolean | `false` |
| wrap | 设置元素单行显示还是多行显示 | 参考 [flex-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap) | nowrap |  |
| justify | 设置元素在主轴方向上的对齐方式 | 参考 [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) | normal |  |
| align | 设置元素在交叉轴方向上的对齐方式 | 参考 [align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) | normal |  |
| flex | flex CSS 简写属性 | 参考 [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex) | normal |  |
| gap | 设置网格之间的间隙 | `small` \ | `middle` \ | `large` \ | string \ | number | - |  |
| component | 自定义元素类型 | Component | `div` |  |
