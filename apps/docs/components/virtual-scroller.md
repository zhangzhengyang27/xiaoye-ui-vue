# VirtualScroller 虚拟滚动器

VirtualScroller 用于高效渲染大规模列表。它只渲染视口内可见的少量条目，并通过 spacer 撑开完整滚动条高度，从而保持 DOM 节点数量稳定，支持万级以上数据流畅滚动。

## 何时使用

- 需要渲染上千甚至上万条数据的长列表时，避免一次性渲染全部 DOM 导致性能下降。
- 时间轴、画廊、聊天记录等需要大量条目的滚动场景。
- 数据需要分批懒加载（结合 `lazy` 与 `lazy-load` 事件）时。

## 基础用法

:::demo 通过 `items` 传入数据数组，`item-size` 指定每项高度（像素），使用 `item` 插槽渲染每一项。下方演示 10000 条数据的虚拟滚动。

virtual-scroller/basic

:::

## 水平滚动

:::demo 设置 `orientation` 为 `horizontal` 可实现水平方向的虚拟滚动，适合横向画廊、卡片列表等场景。

virtual-scroller/horizontal

:::

## 懒加载

:::demo 配合 `lazy` 与 `step` 属性，并通过监听 `lazy-load` 事件按需加载下一批数据。`show-loader` 显示加载提示，`loader` 插槽可自定义加载器样式。

virtual-scroller/lazy-load

:::

## 滚动到指定项

:::demo 通过 ref 调用 `scrollToIndex(index, behavior)` 可跳转到指定项；`scrollTo(options)` 可滚动到指定位置。监听 `scroll-index-change` 事件可实时获取当前可见范围。

virtual-scroller/scroll-to

:::

## 大数据表格

:::demo VirtualScroller 适合渲染大量行的表格。下方通过 `item` 插槽渲染等高行 + 自定义列的表格样式虚拟列表，演示 2000 行数据，每项高度固定 56px，点击行可触发回调，并支持动态增删数据。

virtual-scroller/grid

:::

## API

### VirtualScroller Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 数据数组 | any[] | - |
| itemSize | 每项尺寸（像素），垂直时为高度，水平时为宽度。`both` 布局时为 `[行高, 列宽]` | number \| number[] | `0` |
| orientation | 滚动方向 | `'vertical'` \| `'horizontal'` \| `'both'` | `'vertical'` |
| scrollHeight | 容器高度（CSS 值） | string | - |
| scrollWidth | 容器宽度（CSS 值） | string | - |
| numToleratedItems | 视口外预渲染的容忍项数，越大滚动越平滑但 DOM 越多 | number | 自动计算 |
| delay | 滚动节流延迟（毫秒） | number | `0` |
| resizeDelay | 窗口 resize 后重新计算延迟（毫秒） | number | `10` |
| lazy | 是否启用懒加载 | boolean | `false` |
| loading | 是否处于加载状态（受控） | boolean | `false` |
| disabled | 是否禁用虚拟滚动，直接渲染所有内容 | boolean | `false` |
| step | 懒加载每批数量 | number | `0` |
| showSpacer | 是否显示占位 spacer 以撑开滚动条 | boolean | `true` |
| showLoader | 是否显示加载提示 | boolean | `false` |
| loaderDisabled | 是否禁用加载提示 | boolean | `false` |
| inline | 是否以内联方式渲染 | boolean | `false` |
| appendOnly | 是否仅追加（不回收顶部 DOM），适合聊天等场景 | boolean | `false` |
| autoSize | 是否根据内容自动调整容器尺寸 | boolean | `false` |
| columns | 列数据（`both` 或 `horizontal` 时使用） | any[] | - |
| tabindex | 容器 tabindex 属性 | number \| string | `0` |

### VirtualScroller Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 禁用虚拟滚动时直接渲染的内容 | - |
| item | 渲染每一项 | `{ item, options, index }`，options 含 `index, count, first, last, even, odd` |
| content | 完全自定义内容容器 | 见下方说明 |
| loader | 自定义加载提示 | `{ options }` |
| loadingicon | 自定义加载图标 | - |

### VirtualScroller Events

| 事件名                   | 说明                       | 回调参数          |
| ------------------------ | -------------------------- | ----------------- |
| scroll                   | 滚动时触发                 | `(event: Event)`  |
| scroll-index-change      | 可见项范围变化时触发       | `{ first, last }` |
| lazy-load                | 需要懒加载下一批数据时触发 | `{ first, last }` |
| update:numToleratedItems | 容忍项数变化时触发         | `(value)`         |

### VirtualScroller Methods

通过 ref 可调用以下方法：

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| scrollTo(options) | 滚动到指定位置 | `ScrollToOptions` |
| scrollToIndex(index, behavior) | 滚动到指定项索引 | `index: number \| number[]`, `behavior?: ScrollBehavior` |
| getRenderedRange() | 获取当前渲染范围 | 返回 `{ first, last, viewport: { first, last } }` |
| getOptions(renderedIndex) | 获取某项的渲染选项 | `renderedIndex: number` |

### 使用要点

- `item-size` 必须与实际渲染项高度一致，否则滚动定位会偏移。
- 如需动态高度，建议结合固定行高方案或将变高内容拆分为多段。
- 启用 `lazy` 后，`lazy-load` 事件会在初始化与滚动到边界时触发，参数为 `{ first, last }`。
- 监听 `scroll-index-change` 可实时获取视口范围，常用于「跳转到第 N 项」等交互。
