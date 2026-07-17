# PageHeader 页头

页头位于页容器中，页容器顶部，起到了内容概览和引导页级操作的作用。包括由面包屑、标题、页面内容简介、页面级操作等、页面级导航组成。

## 何时使用

当需要使用户快速理解当前页是什么以及方便用户使用页面功能时使用，通常也可被用作页面间导航。

## 标准样式

:::demo 标准页头，适合使用在需要简单描述的场景。

page-header/basic

:::

## 白底模式

:::demo 默认 PageHeader 是透明底色的。在某些情况下，PageHeader 需要自己的背景颜色。

page-header/ghost

:::

## 带面包屑页头

:::demo 带面包屑页头，适合层级比较深的页面，让用户可以快速导航。

page-header/breadcrumb

:::

## 组合示例

:::demo 使用了 PageHeader 提供的所有能力。

page-header/content

:::

## 多种形态的 PageHeader

:::demo 使用操作区，并自定义子节点，适合使用在需要展示一些复杂的信息，帮助用户快速了解这个页面的信息和操作。

page-header/actions

:::

## 响应式

:::demo 在不同大小的屏幕下，应该有不同的表现。

page-header/responsive

:::

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| avatar | 标题栏旁的头像 | [avatar props](/components/avatar-cn/) | - |
| backIcon | 自定义 back icon ，如果为 false 不渲染 back icon | string\ | slot | `<ArrowLeft />` |
| breadcrumb | 面包屑的配置 | [breadcrumb](/components/breadcrumb-cn/) | - |
| extra | 操作区，位于 title 行的行尾 | string\ | slot | - |
| footer | PageHeader 的页脚，一般用于渲染 TabBar | string\ | slot | - |
| ghost | pageHeader 的类型，将会改变背景颜色 | boolean | true |
| subTitle | 自定义的二级标题文字 | string\ | slot | - |
| tags | title 旁的 tag 列表 | [Tag](/components/tag-cn/)\[] \ | [Tag](/components/tag-cn/) | - |
| title | 自定义标题文字 | string\ | slot | - |

### 事件

| 事件名称 | 说明               | 回调参数    |
| -------- | ------------------ | ----------- |
| back     | 返回按钮的点击事件 | function(e) |
