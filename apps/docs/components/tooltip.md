# Tooltip 文字提示

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## 基本用法

:::demo 最简单的用法。

tooltip/basic

:::

## 位置

:::demo 位置有 12 个方向。

tooltip/placement

:::

## 箭头指向

:::demo 设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。

tooltip/arrow-point-at-center

:::

## 自动调整位置

:::demo 气泡框不可见时自动调整位置。

tooltip/auto-adjust-overflow

:::

## 多彩文字提示

:::demo 我们添加了多种预设色彩的文字提示样式，用作不同场景使用。

tooltip/color

:::

## 箭头展示

:::demo 支持显示、隐藏以及将箭头保持居中定位。

tooltip/arrow

:::

## API

| 参数  | 说明     | 类型    | 默认值 |
| ----- | -------- | ------- | ------ |
| title | 提示文字 | string\ | slot   | -   |

### 共同的 API

以下 API 为 Tooltip、Popconfirm、Popover 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 该值将合并到 placement 的配置中，设置参考 [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrowPointAtCenter | 箭头是否指向目标元素中心 | boolean | `false` |  |
| arrow | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean \ | \{ pointAtCenter: boolean\} | `true` | 4.2.0 |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | `true` |  |
| color | 背景颜色 | string | - |  |
| destroyTooltipOnHide | 隐藏后是否销毁 tooltip | boolean | false |  |
| getPopupContainer | 浮层渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| mouseEnterDelay | 鼠标移入后延时多少才显示 Tooltip，单位：秒 | number | 0.1 |  |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | number | 0.1 |  |
| overlayClassName | 卡片类名 | string | - |  |
| overlayStyle | 卡片样式 | object | - |  |
| overlayInnerStyle | 卡片内容区域样式 | object | - | 4.0 |
| placement | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | top |  |
| trigger | 触发行为，可选 `hover/focus/click/contextmenu` | string | hover |  |
| open(v-model) | 用于手动控制浮层显隐, 小于 4.0.0 使用 `visible` | boolean | false | 4.0 |

### 事件

| 事件名称   | 说明           | 回调参数          | 版本 |
| ---------- | -------------- | ----------------- | ---- |
| openChange | 显示隐藏的回调 | (visible) => void | 4.0  |

## 注意

请确保 `Tooltip` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
