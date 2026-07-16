# Progress 进度条

展示操作的当前进度。

## 何时使用

在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。

- 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过 2 秒时；
- 当需要显示一个操作完成的百分比时。

## 进度条

:::demo 标准的进度条。

progress/line

:::

## 进度圈

:::demo 圈形的进度。

progress/circle

:::

## 小型进度条

:::demo 适合放在较狭窄的区域内。

progress/line-mini

:::

## 小型进度圈

:::demo 小一号的圈形进度。

progress/circle-mini

:::

## 动态展示

:::demo 会动的进度条才是好进度条。

progress/dynamic

:::

## 进度圈动态展示

:::demo 会动的进度条才是好进度条。

progress/circle-dynamic

:::

## 自定义文字格式

:::demo `format` 属性指定格式。

progress/format

:::

## 仪表盘

:::demo 通过设置 `type=dashboard`，可以很方便地实现仪表盘样式的进度条。若想要修改缺口的角度，可以设置 `gapDegree` 为你想要的值。

progress/dashboard

:::

## 分段进度条

:::demo 标准的进度条。

progress/segment

:::

## 圆角/方角边缘

| :::demo `strokeLinecap="square | round"` 可以调整进度条边缘的形状。 |

progress/linecap

:::

## 自定义进度条渐变色

:::demo `linear-gradient` 的封装。推荐只传两种颜色。

progress/gradient-line

:::

## 进度条尺寸

:::demo 进度条尺寸。

progress/size

:::

## 步骤进度条

:::demo 带步骤的进度条。

progress/steps

:::

## 响应式进度圈

:::demo 响应式的圈形进度，当 `width` 小于等于 20 的时候，进度信息将不会显示在进度圈里面，而是以 Tooltip 的形式显示。

progress/circle-micro

:::

## API

各类型共用的属性。

|  属性  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  format  |  内容的模板函数  |  function(percent, successPercent)  |  (percent) => percent + `%`  |    |
|  percent  |  百分比  |  number  |  0  |    |
|  showInfo  |  是否显示进度数值或状态图标  |  boolean  |  true  |    |
|  status  |  状态，可选：`success` `exception` `normal` `active`(仅限 line)  |  string  |  -  |    |
|  strokeColor  |  进度条的色彩  |  string  |  -  |    |
|  strokeLinecap  |  进度条的样式  |  `round` \ |  `butt` \ |  `square`，区别详见 [stroke-linecap](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap)  |  `round`  |  -  |
|  success  |  成功进度条相关配置  |  \{ percent: number, strokeColor: string \}  |  -  |    |
|  title  |  html 标签 title  |  string  |  -  |  3.0  |
|  trailColor  |  未完成的分段的颜色  |  string  |  -  |    |
|  type  |  类型，可选 `line` `circle` `dashboard`  |  string  |  `line`  |    |
|  size  |  进度条的尺寸  |  number \ |  \[number, number] \ |  "small" \ |  "default"  |  "default"  |    |

### `type="line"`

|  属性  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  steps  |  进度条总共步数  |  number  |  -  |  -  |
|  strokeColor  |  进度条的色彩，传入 object 时为渐变。当有 `steps` 时支持传入一个数组。  |  string \ |  string[] \ |  \{ from: string; to: string; direction: string \}  |  -  |  -  |

### `type="circle"`

|  属性  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  strokeColor  |  圆形进度条线的色彩，传入 object 时为渐变  |  string \ |  object  |  -  |  -  |
|  strokeWidth  |  圆形进度条线的宽度，单位是进度条画布宽度的百分比  |  number  |  6  |  -  |

### `type="dashboard"`

|  属性  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  gapDegree  |  仪表盘进度条缺口角度，可取值 0 ~ 295  |  number  |  75  |  -  |
|  gapPosition  |  仪表盘进度条缺口位置  |  `top` \ |  `bottom` \ |  `left` \ |  `right`  |  `bottom`  |  -  |
|  strokeWidth  |  仪表盘进度条线的宽度，单位是进度条画布宽度的百分比  |  number  |  6  |  -  |
