# Popover 气泡卡片

点击/鼠标移入元素，弹出气泡式的卡片浮层。

## 何时使用

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。

和 `Tooltip` 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

## 基本用法

:::demo 最简单的用法，浮层的大小由内容区域决定。

popover/basic

:::

## 三种触发方式

:::demo 鼠标移入、聚集、点击。

popover/triggerType

:::

## 位置

:::demo 位置有十二个方向。

popover/placement

:::

## 从浮层内关闭

:::demo 使用 `visible` 属性控制浮层显示。

popover/control

:::

## 箭头指向

:::demo 设置了 `arrowPointAtCenter` 后，箭头将指向目标元素的中心。

popover/arrow-point-at-center

:::

## 悬停点击弹出窗口

:::demo 以下示例显示如何创建可悬停和单击的弹出窗口。

popover/hover-with-click

:::

## API

|  参数     |  说明      |  类型                 |  默认值  |  版本  |
| ------- | -------- | ------------------- | ------ | ---- |
|  content  |  卡片内容  |  string\ | slot\ | VNode  |  -       |        |
|  title    |  卡片标题  |  string\ | slot\ | VNode  |  -       |        |

更多属性请参考 [Tooltip](/components/tooltip-cn/#api)。

## 注意

请确保 `Popover` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
