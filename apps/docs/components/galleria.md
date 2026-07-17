# Galleria 画廊

用于展示一组图片或多媒体内容的轮播画廊组件，支持缩略图、指示器、全屏、自动播放等能力。

## 何时使用

- 商品详情图、相册、作品集等图片轮播展示。
- 需要缩略图导航、全屏查看、自动播放等富交互场景。
- 需要自定义指示器、标题、导航按钮的展示。

## 基础用法

:::demo 通过 `value` 传入图片数据数组，使用 `item` 与 `thumbnail` 插槽分别自定义主图与缩略图内容，插槽参数为 `{ item }`。

galleria/basic

:::

## 缩略图配置

:::demo 通过 `num-visible` 控制可见缩略图数量，`responsive-options` 配置不同断点下的可见数量，`thumbnails-position` 调整缩略图位置。

galleria/with-thumbnails

:::

## 全屏模式

:::demo 设置 `full-screen` 开启全屏模式，通过 `v-model:visible` 控制显隐。点击遮罩或关闭按钮（ESC）可关闭。

galleria/fullscreen

:::

## 带标题

:::demo 使用 `caption` 插槽为当前图片渲染标题与描述信息，插槽参数为 `{ item }`。

galleria/with-caption

:::

## 自动播放

:::demo 设置 `auto-play` 与 `circular` 开启循环自动播放，`transition-interval` 控制切换间隔（毫秒）。

galleria/autoplay

:::

## API

### Galleria Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 图片数据数组 | any[] \| null | null |
| active-index | 当前激活项索引 | number | 0 |
| full-screen | 是否全屏显示 | boolean | false |
| visible | 全屏模式下是否可见 | boolean | false |
| num-visible | 可见缩略图数量 | number | 3 |
| responsive-options | 响应式断点配置 | GalleriaResponsiveOptions[] \| null | null |
| show-item-navigators | 是否显示主图导航按钮 | boolean | false |
| show-thumbnail-navigators | 是否显示缩略图导航按钮 | boolean | true |
| show-item-navigators-on-hover | 悬停时才显示主图导航按钮 | boolean | false |
| change-item-on-indicator-hover | 悬停指示器时切换图片 | boolean | false |
| circular | 是否循环播放 | boolean | false |
| auto-play | 是否自动播放 | boolean | false |
| transition-interval | 自动播放切换间隔（毫秒） | number | 4000 |
| show-thumbnails | 是否显示缩略图 | boolean | true |
| thumbnails-position | 缩略图位置 | `top` \| `bottom` \| `left` \| `right` | `bottom` |
| vertical-thumbnail-view-port-height | 垂直缩略图视口高度 | string | `300px` |
| show-indicators | 是否显示指示器 | boolean | false |
| show-indicators-on-item | 指示器是否叠加在主图上 | boolean | false |
| indicators-position | 指示器位置 | `top` \| `bottom` \| `left` \| `right` | `bottom` |
| base-z-index | 全屏模式基础 z-index | number | 0 |
| mask-class | 全屏遮罩自定义类名 | string \| null | null |
| container-style | 全屏容器自定义样式 | any | null |
| container-class | 全屏容器自定义类名 | any | null |

### GalleriaResponsiveOptions

| 属性        | 说明             | 类型   |
| ----------- | ---------------- | ------ |
| breakpoint  | 媒体查询断点     | string |
| num-visible | 该断点下可见数量 | number |

### Galleria Events

| 事件名             | 说明                 | 回调参数           |
| ------------------ | -------------------- | ------------------ |
| update:activeIndex | 激活项变化时触发     | (index: number)    |
| update:visible     | 全屏可见性变化时触发 | (visible: boolean) |

### Galleria Slots

| 插槽名                | 说明             | 参数                             |
| --------------------- | ---------------- | -------------------------------- |
| item                  | 主图内容模板     | { item }                         |
| thumbnail             | 缩略图内容模板   | { item }                         |
| caption               | 标题内容模板     | { item }                         |
| indicator             | 指示器自定义模板 | { index, activeIndex, tabindex } |
| header                | 顶部内容         | -                                |
| footer                | 底部内容         | -                                |
| previousitemicon      | 主图上一项图标   | -                                |
| nextitemicon          | 主图下一项图标   | -                                |
| previousthumbnailicon | 缩略图上一组图标 | -                                |
| nextthumbnailicon     | 缩略图下一组图标 | -                                |
| closeicon             | 全屏关闭按钮图标 | -                                |
