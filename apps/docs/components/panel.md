# Panel 面板

Panel 是一个内容容器组件，用于将相关内容组织到独立的卡片区域中。支持标题、头部、底部、操作按钮插槽，以及加载、悬停、折叠等状态。

## 何时使用

- 需要将一组相关内容（如表单、统计、列表）组织成独立区块时。
- 详情页、仪表盘等需要分区域展示信息时。
- 需要可折叠的内容区域，节省页面空间时。

## 基础用法

:::demo 通过 `title` 设置面板标题，`bordered` 控制边框，`hoverable` 启用悬停阴影提升效果。

panel/basic

:::

## 可折叠

:::demo 设置 `toggleable` 后标题右侧出现切换按钮，点击可折叠 / 展开。支持通过 `v-model:collapsed` 受控使用，未传值时为非受控模式。

panel/toggleable

:::

## 头部和底部插槽

:::demo 通过 `header` 插槽完全自定义头部内容，`icons` 插槽放置操作按钮，`footer` 插槽放置底部操作区。

panel/header-footer

:::

## 操作按钮与加载状态

:::demo `icons` 插槽常用于放置刷新、更多等操作按钮。设置 `loading` 可显示加载骨架，适合异步加载数据场景。

panel/with-actions

:::

## 自定义头部

:::demo `header` 插槽支持任意内容，例如嵌入 Tabs 实现标题切换；`title` 插槽则保留默认头部布局，仅替换标题区域，适合加入徽标等装饰。

panel/custom-header

:::

## API

### Panel Props

| 属性       | 说明                 | 类型    | 默认值  |
| ---------- | -------------------- | ------- | ------- |
| title      | 面板标题文本         | string  | -       |
| bordered   | 是否显示边框         | boolean | `true`  |
| loading    | 是否显示加载骨架     | boolean | `false` |
| hoverable  | 鼠标悬停是否提升阴影 | boolean | `false` |
| toggleable | 是否可折叠           | boolean | `false` |
| collapsed  | 当前折叠状态（受控） | boolean | -       |

### Panel Slots

| 插槽名  | 说明                                               |
| ------- | -------------------------------------------------- |
| default | 面板正文内容                                       |
| title   | 标题区域内容（保留默认头部布局）                   |
| header  | 完整的头部区域，优先级高于 `title` 与 `title` prop |
| icons   | 头部右侧操作区域                                   |
| footer  | 底部区域                                           |

### Panel Events

| 事件名           | 说明               | 回调参数                   |
| ---------------- | ------------------ | -------------------------- |
| update:collapsed | 折叠状态变化时触发 | `(value: boolean)`         |
| toggle           | 切换折叠状态时触发 | `{ originalEvent, value }` |

### 折叠状态说明

- `toggleable` 为 `true` 时才会显示折叠按钮。
- 未传入 `collapsed` 时为非受控模式，组件内部维护状态。
- 通过 `v-model:collapsed` 绑定后为受控模式，需由外部控制状态。
- `header` 插槽优先级最高，其次为 `title` 插槽，最后为 `title` prop。
