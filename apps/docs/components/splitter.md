# Splitter 分割面板

Splitter 用于将一个区域分割为多个可调整大小的面板，支持水平与垂直布局，并支持嵌套使用。配合 `SplitterPanel` 子组件定义每个面板的初始尺寸与最小尺寸。

## 何时使用

- 需要将页面或区域分为多个可调整宽度的分栏，例如侧栏 + 主内容 + 属性面板的布局。
- 代码编辑器、终端、日志窗口等需要灵活调整上下高度的场景。
- 需要将面板尺寸持久化到本地存储，下次打开时恢复上次布局时。

## 基础用法

:::demo 使用 `xy-splitter` 配合 `xy-splitter-panel` 创建水平分割布局，通过 `size` 指定初始占比百分比。拖动中间分隔条即可调整两侧宽度。

splitter/basic

:::

## 垂直分割

:::demo 设置 `layout` 为 `vertical` 可实现上下分割布局，分隔条变为水平方向。

splitter/vertical

:::

## 嵌套分割

:::demo Splitter 支持嵌套使用。外层水平分割后，在中间面板内再放置一个垂直 Splitter，可形成复杂布局。

splitter/nested

:::

## 最小尺寸限制

:::demo 通过 `xy-splitter-panel` 的 `min-size` 属性可限制面板的最小占比百分比，防止内容被过度压缩。

splitter/min-size

:::

## 受控模式

:::demo 监听 `resize`、`resize-start`、`resize-end` 事件可实时获取各面板的尺寸百分比，实现受控展示或同步到状态管理。

splitter/controlled

:::

## 状态持久化

:::demo 配置 `state-key` 后，面板尺寸会自动持久化到 `sessionStorage`（默认）或 `localStorage`，刷新页面后恢复上次布局。

splitter/stateful

:::

## API

### Splitter Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 分割方向 | `'horizontal'` \| `'vertical'` | `'horizontal'` |
| gutterSize | 分隔条尺寸（像素） | number | `4` |
| step | 键盘方向键单次调整步长（百分比） | number | `5` |
| stateKey | 状态持久化的键名，传入后启用持久化 | string | - |
| stateStorage | 持久化存储类型 | `'local'` \| `'session'` | `'session'` |

### Splitter Events

| 事件名       | 说明                 | 回调参数                   |
| ------------ | -------------------- | -------------------------- |
| resize-start | 开始拖动时分隔条触发 | `{ originalEvent, sizes }` |
| resize       | 拖动过程中持续触发   | `{ originalEvent, sizes }` |
| resize-end   | 拖动结束触发         | `{ originalEvent, sizes }` |

> `sizes` 为各面板当前占比百分比数组，顺序与 `xy-splitter-panel` 出现顺序一致。

### SplitterPanel Props

| 属性    | 说明                               | 类型   | 默认值   |
| ------- | ---------------------------------- | ------ | -------- |
| size    | 面板初始占比百分比                 | number | 平均分配 |
| minSize | 面板最小占比百分比，防止被过度压缩 | number | `0`      |

### SplitterPanel Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 面板内容 |

### 交互说明

- 支持鼠标拖动分隔条调整尺寸。
- 分隔条获取焦点后，支持 `ArrowLeft` / `ArrowRight`（水平布局）或 `ArrowUp` / `ArrowDown`（垂直布局）通过键盘调整。
- 每个面板的尺寸由 `flex-basis` 控制，会自动减去分隔条占用空间。
- 嵌套使用时，内层 Splitter 会自动添加 `nested` 样式类，避免外层分隔条的边距干扰。
