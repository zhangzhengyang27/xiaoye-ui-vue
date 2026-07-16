# Divider 分割线

区隔内容的分割线。

## 何时使用

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## 水平分割线

:::demo 默认为水平分割线，可在中间加入文字。

divider/horizontal

:::

## 带文字的分割线

:::demo 分割线中带有文字，可以用 `orientation` 指定文字位置。

divider/with-text

:::

## 垂直分割线

:::demo 使用 `type="vertical"` 设置为行内的垂直分割线。

divider/vertical

:::

## 样式自定义

:::demo 测试一些 `style` 修改样式的行为。

divider/customize-style

:::

## API

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  dashed  |  是否虚线  |  boolean  |  false  |    |
|  orientation  |  分割线标题的位置  |  `left` \ |  `right` \ |  `center`  |  `center`  |
|  orientationMargin  |  标题和最近 left/right 边框之间的距离，去除了分割线，同时 `orientation` 必须为 `left` 或 `right`  |  string \ |  number  |  -  |  3.0  |
|  plain  |  文字是否显示为普通正文样式  |  boolean  |  false  |  2.2.0  |
|  type  |  水平还是垂直类型  |  `horizontal` \ |  `vertical`  |  `horizontal`  |    |
