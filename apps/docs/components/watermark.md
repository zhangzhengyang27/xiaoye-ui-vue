# Watermark 水印

给页面的某个区域加上水印。

## 何时使用

- 页面需要添加水印标识版权时使用。
- 适用于防止信息盗用。

## 基本

:::demo 最简单的用法。

watermark/basic

:::

## 自定义配置

:::demo 通过自定义参数配置预览水印效果。

watermark/custom

:::

## 图片水印

:::demo 通过 `image` 指定图片地址。为保证图片高清且不被拉伸，请设置 width 和 height, 并上传至少两倍的宽高的 logo 图片地址。

watermark/image

:::

## 多行水印

:::demo 通过 `content` 设置 字符串数组 指定多行文字水印内容。

watermark/multi-line

:::

## 图片水印（参数化）

:::demo 使用图片作为水印内容，并通过 xy-slider 实时调整 width / height / rotate / gap 等参数。

watermark/image-watermark

:::

## 自定义样式

:::demo 实时调整水印样式参数（颜色、字号、旋转角度、间距等）。

watermark/custom-style

:::

## API

### Watermark

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| width | 水印的宽度，`content` 的默认值为自身的宽度 | number | 120 |  |
| height | 水印的高度，`content` 的默认值为自身的高度 | number | 64 |  |
| rotate | 水印绘制时，旋转的角度，单位 `°` | number | -22 |  |
| zIndex | 追加的水印元素的 z-index | number | 9 |  |
| image | 图片源，建议导出 2 倍或 3 倍图，优先级高 | string | - |  |
| content | 水印文字内容 | string \ | string[] | - |  |
| font | 文字样式 | [Font](#font) | [Font](#font) |  |
| gap | 水印之间的间距 | \[number, number\] | \[100, 100\] |  |
| offset | 水印距离容器左上角的偏移量，默认为 `gap/2` | \[number, number\] | \[gap\[0\]/2, gap\[1\]/2\] |  |

### Font

<!-- prettier-ignore -->
|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  color  |  字体颜色  |  string  |  rgba(0,0,0,.15)  |    |
|  fontSize  |  字体大小  |  number  |  16  |    |
|  fontWeight  |  字体粗细  |  `normal` \ |  `light` \ |  `weight` \ |  number  |  normal  |    |
|  fontFamily  |  字体类型  |  string  |  sans-serif  |    |
|  fontStyle  |  字体样式  |  `none` \ |  `normal` \ |  `italic` \ |  `oblique`  |  normal  |    |
