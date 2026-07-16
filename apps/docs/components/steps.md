# Steps 步骤条

引导用户按照流程完成任务的导航条。

## 何时使用

当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。

## 基本用法

:::demo 简单的步骤条。

steps/simple

:::

## 迷你版

:::demo 迷你版的步骤条，通过设置 `<Steps size="small">` 启用.

steps/small-size

:::

## 带图标的步骤条

:::demo 通过设置 `Steps.Step` 的 `icon` 属性，可以启用自定义图标。

steps/icon

:::

## 内联步骤条

:::demo 内联类型的步骤条，适用于列表内容场景中展示对象所在流程、当前状态的情况。

steps/inline

:::

## 步骤切换

:::demo 通常配合内容及按钮使用，表示一个流程的处理进度。

steps/step-next

:::

## 竖直方向的步骤条

:::demo 简单的竖直方向的步骤条。

steps/vertical

:::

## 标签放置位置

:::demo 修改标签放置位置为 `vertical`。

steps/label-placement

:::

## 竖直方向的小型步骤条

:::demo 简单的竖直方向的小型步骤条。

steps/vertical-small

:::

## 步骤运行错误

:::demo 使用 Steps 的 `status` 属性来指定当前步骤的状态。

steps/error

:::

## 点状步骤条

:::demo 包含步骤点的进度条。

steps/progress-dot

:::

## 自定义点状步骤条

:::demo 为点状步骤条增加自定义展示。

steps/customized-progress-dot

:::

## 可点击

:::demo 设置 `v-model` 后，Steps 变为可点击状态。

steps/clickable

:::

## 导航步骤

:::demo 导航类型的步骤条。

steps/nav

:::

## 带有进度的步骤

:::demo 带有进度的步骤。

steps/progress

:::

## API

### Steps

整体步骤条。

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  current (v-model)  |  指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态, 1.5.0 后支持 v-model  |  number  |  0  |    |
|  direction  |  指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向  |  string  |  horizontal  |    |
|  initial  |  起始序号，从 0 开始记数  |  number  |  0  |    |
|  labelPlacement  |  指定标签放置位置，默认水平放图标右侧，可选`vertical`放图标下方  |  string  |  `horizontal`  |    |
|  percent  |  当前 `process` 步骤显示的进度条进度（只对基本类型的 Steps 生效）  |  number  |  -  |  3.0  |
|  progressDot  |  点状步骤条，可以设置为一个 作用域插槽,labelPlacement 将强制为`vertical`  |  Boolean or v-slot:progressDot="\{index, status, title, description, prefixCls, iconDot\}"  |  false  |    |
|  responsive  |  当屏幕宽度小于 532px 时自动变为垂直模式  |  boolean  |  true  |  3.0  |
|  size  |  指定大小，目前支持普通（`default`）和迷你（`small`）  |  string  |  default  |    |
|  status  |  指定当前步骤的状态，可选 `wait` `process` `finish` `error`  |  string  |  process  |    |
|  type  |  步骤条类型，有 `default` 和 `navigation` 两种  |  string  |  `default`  |  1.5.0  |
|  items  |  配置选项卡内容  |  [StepItem](#stepsstep)[]  |  []  |    |

### `type="inline"` (4.0+)

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  current  |  指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态  |  number  |  0  |    |
|  initial  |  起始序号，从 0 开始记数  |  number  |  0  |    |
|  status  |  指定当前步骤的状态，可选 `wait` `process` `finish` `error`  |  string  |  `process`  |    |
|  items  |  配置选项卡内容，不支持 `icon` `subtitle`  |  [StepItem](#stepsstep)  |  []  |    |

#### Steps 事件

|  事件名称  |  说明                |  回调参数           |  版本  |         |
| -------- | ------------------ | ----------------- | ---- | ----- |
|  change    |  点击切换步骤时触发  |  (current) => void  |  -     |  1.5.0  |

### Steps.Step

步骤条内的每一个步骤。

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  description  |  步骤的详情描述，可选  |  string \ |  slot  |  -  |    |
|  disabled  |  禁用点击  |  boolean  |  false  |  1.5.0  |
|  icon  |  步骤图标的类型，可选  |  string \ |  slot  |  -  |    |
|  status  |  指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait` `process` `finish` `error`  |  string  |  `wait`  |    |
|  subTitle  |  子标题  |  string \ |  slot  |  -  |  1.5.0  |
|  title  |  标题  |  string \ |  slot  |  -  |    |
