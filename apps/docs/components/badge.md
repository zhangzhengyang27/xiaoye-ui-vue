# Badge 徽标数

图标右上角的圆形徽标数字。

## 何时使用

一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户处理。

## 基本

:::demo 简单的徽章展示，当 `count` 为 `0` 时，默认不显示，但是可以使用 `showZero` 修改为显示。

badge/basic

:::

## 独立使用

:::demo 不包裹任何元素即是独立使用，可自定样式展现。 在右上角的 badge 则限定为红色。

badge/no-wrapper

:::

## 封顶数字

:::demo 超过 `overflowCount` 的会显示为 `${overflowCount}+`，默认的 `overflowCount` 为 `99`。

badge/overflow

:::

## 讨嫌的小红点

:::demo 没有具体的数字。

badge/dot

:::

## 状态点

:::demo 用于表示状态的小圆点。

badge/status

:::

## 动态

:::demo 展示动态变化的效果。

badge/change

:::

## 自定义标题

:::demo 设置鼠标放在状态点上时显示的文字

badge/title

:::

## 多彩徽标

:::demo 1.5.0 后新增。我们添加了多种预设色彩的徽标样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。

badge/colors

:::

## 可点击

:::demo 用 a 标签进行包裹即可。

badge/link

:::

## 缎带

:::demo 使用缎带型的徽标。

badge/ribbon

:::

## API

```html
<a-badge :count="5">
  <a href="#" class="head-example" />
</a-badge>
```

```html
<a-badge :count="5" />
```

### Badge

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  color  |  自定义小圆点的颜色  |  string  |  -  |  1.5.0  |
|  count  |  展示的数字，大于 overflowCount 时显示为 `${overflowCount}+`，为 0 时隐藏  |  number \ |  string \ |  slot  |    |    |
|  dot  |  不展示数字，只有一个小红点  |  boolean  |  false  |    |
|  numberStyle  |  设置状态点的样式  |  object  |  ''  |    |
|  offset  |  设置状态点的位置偏移，格式为 [x, y]  |  [number\ | string, number\ | string]  |  -  |    |
|  overflowCount  |  展示封顶的数字值  |  number  |  99  |    |
|  showZero  |  当数值为 0 时，是否展示 Badge  |  boolean  |  false  |    |
|  status  |  设置 Badge 为状态点  |  Enum\{ 'success', 'processing, 'default', 'error', 'warning' \}  |  ''  |    |
|  text  |  在设置了 `status` 的前提下有效，设置状态点的文本  |  string  |  ''  |    |
|  title  |  设置鼠标放在状态点上时显示的文字  |  string  |  `count`  |    |

### Badge.Ribbon (2.0.1+)

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  color  |  自定义缎带的颜色  |  string  |  -  |    |
|  placement  |  缎带的位置，`start` 和 `end` 随文字方向（RTL 或 LTR）变动  |  `start` \ |  `end`  |  `end`  |    |
|  text  |  缎带中填入的内容  |  string \ |  VNode \ |  slot  |  -  |    |
