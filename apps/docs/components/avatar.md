# Avatar 头像

用来代表用户或事物，支持图片、图标或字符展示。

## 设计师专属

安装 [Kitchen Sketch 插件 💎](https://kitchen.alipay.com)，一键填充高逼格头像和文本。

## 基本

:::demo 头像有三种尺寸，两种形状可选。

avatar/basic

:::

## 类型

:::demo 支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。

avatar/type

:::

## 自动调整字符大小

:::demo 对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。也可使用 `gap` 来设置字符距离左右两侧边界单位像素。

avatar/dynamic

:::

## 带徽标的头像

:::demo 通常用于消息提示。

avatar/badge

:::

## Avatar.Group

:::demo 头像组合展现。

avatar/group

:::

## 响应式尺寸

:::demo 头像大小可以根据屏幕大小自动调整。

avatar/responsive

:::

## API

### Avatar

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| alt | 图像无法显示时的替代文本 | string | - |  |
| crossOrigin | cors 属性设置 | `'anonymous'` \ | `'use-credentials'` \ | `''` | - | 3.0 |
| draggable | 图片是否允许拖动 | boolean \ | `'true'` \ | `'false'` | - | 2.2.0 |
| gap | 字符类型距离左右两侧边界单位像素 | number | 4 | 2.2.0 |
| icon | 设置头像的图标类型，可设为 Icon 的 `type` 或 VNode | VNode \ | slot | - |  |
| loadError | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为 | () => boolean | - |  |
| shape | 指定头像的形状 | `circle` \ | `square` | `circle` |  |
| size | 设置头像的大小 | number \ | `large` \ | `small` \ | `default` \ | `{ xs: number, sm: number, ...}` | `default` | 2.2.0 |
| src | 图片类头像的资源地址 | string | - |  |
| srcset | 设置图片类头像响应式资源地址 | string | - |  |

### Avatar.Group (2.2.0)

| 参数                | 说明                            | 类型          | 默认值    | 版本      |
| ------------------- | ------------------------------- | ------------- | --------- | --------- |
| maxCount            | 显示的最大头像个数              | number        | -         |           |
| maxPopoverPlacement | 多余头像气泡弹出位置            | `top` \       | `bottom`  | `top`     |             |
| maxPopoverTrigger   | 设置多余头像 Popover 的触发方式 | `hover` \     | `focus` \ | `click`   | `hover`     | 3.0                              |
| maxStyle            | 多余头像样式                    | CSSProperties | -         |           |
| size                | 设置头像的大小                  | number \      | `large` \ | `small` \ | `default` \ | `{ xs: number, sm: number, ...}` | `default` |     |
| shape               | 设置头像的形状                  | `circle` \    | `square`  | `circle`  | 4.0         |
