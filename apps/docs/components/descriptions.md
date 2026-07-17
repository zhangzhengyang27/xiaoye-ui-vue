# Descriptions 描述列表

成组展示多个只读字段。

## 何时使用

常见于详情页的信息展示。

## 基本

:::demo 简单的展示。

descriptions/basic

:::

## 带边框的

:::demo 带边框和背景颜色列表。

descriptions/border

:::

## 自定义尺寸

:::demo 自定义尺寸，适应在各种容器中展示。

descriptions/size

:::

## 响应式

:::demo 通过响应式的配置可以实现在小屏幕设备上的完美呈现。

descriptions/responsive

:::

## 垂直

:::demo 垂直的列表。

descriptions/vertical

:::

## 垂直带边框的

:::demo 垂直带边框和背景颜色的列表。

descriptions/vertical-border

:::

## API

### Descriptions props

| 参数 | 说明 | 类型 | 默认值 | 版本 |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false |  |  |  |
| colon | 配置 `Descriptions.Item` 的 `colon` 的默认值 | boolean | true |  |  |  |
| column | 一行的 `DescriptionItems` 数量，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` | number | 3 |  |  |  |
| contentStyle | 自定义内容样式 | CSSProperties | - | 2.2.0 |  |  |
| extra | 描述列表的操作区域，显示在右上方 | string \ | VNode \ | slot | - | 2.0.0 |  |  |
| labelStyle | 自定义标签样式 | CSSProperties | - | 2.2.0 |  |  |
| layout | 描述布局 | `horizontal` \ | `vertical` | `horizontal` |  |  |
| size | 设置列表的大小。可以设置为 `middle` 、`small`, 或不填（只有设置 `bordered={true}` 生效） | `default` \ | `middle` \ | `small` | `default` |  |
| title | 描述列表的标题，显示在最顶部 | string \ | VNode \ | slot | - |  |  |  |

### Item props

| 参数         | 说明           | 类型          | 默认值  | 版本  |
| ------------ | -------------- | ------------- | ------- | ----- |
| contentStyle | 自定义内容样式 | CSSProperties | -       | 2.2.0 |
| label        | 内容的描述     | string \      | VNode \ | slot  | -   |     |
| labelStyle   | 自定义标签样式 | CSSProperties | -       | 2.2.0 |
| span         | 包含列的数量   | number        | 1       |       |

> span 是 Descriptions.Item 的数量。 span={2} 会占用两个 DescriptionsItem 的宽度。
