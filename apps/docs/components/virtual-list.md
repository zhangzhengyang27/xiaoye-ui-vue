# VirtualList 虚拟列表

用于渲染大量数据列表，仅渲染可视区域项以提升性能。

## 何时使用

- 需要渲染成千上万条数据时。
- 长列表滚动性能成为瓶颈时。

## 基础用法

:::demo 传入 `items` 和 `item-size`，通过默认插槽渲染每一项。

virtual-list/basic

:::

## 横向虚拟列表

:::demo 设置 `orientation="horizontal"` 实现横向虚拟滚动。

virtual-list/horizontal

:::

## API

通过设置 VirtualList 的属性来控制列表的渲染行为。

### 属性

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| appendOnly | 仅追加模式，滚动时只新增下方/右侧项而不回收上方/左侧项，适合聊天、日志等场景 | boolean | `false` |  |
| autoSize | 是否根据实际内容自动调整容器大小 | boolean | `false` |  |
| class | 自定义类名 | string \| object \| array | - |  |
| columns | 二维数据列定义，配合 `orientation="horizontal"` 或 `"both"` 使用 | any[] | - |  |
| delay | 滚动延迟（毫秒），用于节流滚动更新；为 `0` 时实时更新 | number | `0` |  |
| disabled | 是否禁用虚拟滚动，禁用后将完整渲染 `items` | boolean | `false` |  |
| id | 容器元素 id | string | - |  |
| inline | 是否以内联元素方式渲染容器 | boolean | `false` |  |
| itemSize | 每项尺寸；纵向为高度，横向为宽度，`both` 模式下为 `[rowHeight, colWidth]` | number \| number[] | `0` |  |
| items | 列表数据 | any[] | - |  |
| lazy | 是否启用懒加载，配合 `lazy-load` 事件按需加载数据 | boolean | `false` |  |
| loaderDisabled | 是否禁用加载占位，配合 `showLoader` 使用 | boolean | `false` |  |
| loading | 是否处于加载状态，受 `lazy` 影响 | boolean | `false` |  |
| numToleratedItems | 视口外额外渲染的项数，用于减少快速滚动白屏；不设置时自动计算 | number | - |  |
| orientation | 滚动方向 | `vertical` \| `horizontal` \| `both` | `vertical` |  |
| prefixCls | 自定义样式前缀 | string | - |  |
| resizeDelay | 容器尺寸变化重新计算的延迟（毫秒） | number | `10` |  |
| scrollHeight | 容器高度，纵向滚动时生效 | string | - |  |
| scrollWidth | 容器宽度，横向/双向滚动时生效 | string | - |  |
| showLoader | 是否在滚动加载时显示加载占位 | boolean | `false` |  |
| showSpacer | 是否显示撑开总高度的占位元素 | boolean | `true` |  |
| step | 懒加载分页步长，配合 `lazy` 使用 | number | `0` |  |
| style | 自定义样式 | CSSProperties | - |  |
| tabindex | 容器 tabindex | number \| string | `0` |  |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| lazy-load | 懒加载触发时回调，参数包含当前需要加载的区间 | `({ first, last }) => void` |  |
| scroll | 容器滚动时触发 | `(event: Event) => void` |  |
| scroll-index-change | 可视区域索引变化时触发 | `(event: { first, last }) => void` |  |
| update:numToleratedItems | `numToleratedItems` 变化时触发，用于 `v-model:numToleratedItems` | `(value: number \| number[]) => void` |  |

### 方法

通过 `ref` 可以调用以下方法：

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| scrollTo | 滚动到指定位置 | `(options: ScrollToOptions) => void` |  |
| scrollToIndex | 滚动到指定索引 | `(index: number \| number[], behavior?: ScrollBehavior) => void` |  |
| getRenderedRange | 获取当前渲染范围 | `() => { first, last, viewport: { first, last } }` |  |
| getOptions | 获取指定渲染索引对应的项选项 | `(renderedIndex: number) => VirtualListItemOptions` |  |
| getLoaderOptions | 获取加载占位项的选项 | `(index: number, extOptions?: any) => any` |  |

### 插槽

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| default | 禁用虚拟滚动时（`disabled`）渲染的内容 | - |  |
| content | 自定义整个内容区域，接收渲染状态和数据 | `ContentSlotParams` |  |
| item | 自定义每一项的渲染内容 | `{ item, options: VirtualListItemOptions, index }` |  |
| loader | 自定义加载占位内容 | `{ options: VirtualListItemOptions }` |  |
| loadingicon | 自定义加载图标 | - |  |

#### ContentSlotParams

| 属性             | 说明                 | 类型                                        |
| ---------------- | -------------------- | ------------------------------------------- |
| styleClass       | 内容区域类名         | string \| object \| array                   |
| items            | 当前渲染的数据项     | any[]                                       |
| getItemOptions   | 获取项选项的方法     | `(index: number) => VirtualListItemOptions` |
| loading          | 是否加载中           | boolean                                     |
| getLoaderOptions | 获取加载项选项的方法 | `(index: number, extOptions?: any) => any`  |
| itemSize         | 当前 itemSize        | number \| number[]                          |
| rows             | 当前渲染的行数据     | any[]                                       |
| columns          | 当前渲染的列数据     | any[]                                       |
| contentRef       | 内容区域 ref 回调    | `(el: HTMLElement \| null) => void`         |
| spacerStyle      | 占位元素样式         | object                                      |
| contentStyle     | 内容区域样式         | object                                      |
| vertical         | 是否为纵向           | boolean                                     |
| horizontal       | 是否为横向           | boolean                                     |
| both             | 是否为双向           | boolean                                     |

## 类型

从 `xiaoye-ui/virtual-list` 导出的 TypeScript 类型：

| 类型                              | 说明                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| VirtualListProps                  | VirtualList 组件的 Props 类型                              |
| VirtualListOrientation            | 滚动方向：`'vertical' \| 'horizontal' \| 'both'`           |
| VirtualListScrollIndexChangeEvent | 滚动索引变化事件对象：`{ first, last }`                    |
| VirtualListItemOptions            | 渲染项选项对象：`{ index, count, first, last, even, odd }` |

## 使用指南

### itemSize

`itemSize` 是虚拟列表计算可视区域的基础。建议设置为列表项的平均高度（纵向）或平均宽度（横向）：

- 纵向滚动：`itemSize` 为单个条目高度（像素）。
- 横向滚动：`itemSize` 为单个条目宽度（像素）。
- 双向滚动：`itemSize` 为 `[rowHeight, colWidth]`。

如果设置为 `0`，组件会依赖容器尺寸进行兜底计算，但可能不准确。

### numToleratedItems

该属性控制视口上下/左右额外渲染的条目数量，用于缓解快速滚动时的白屏问题。默认会根据可视区条目数自动计算（约为可视区条目数的一半）。当列表项高度不固定或滚动速度较快时，可适当增大该值。

### lazy 与 step

开启 `lazy` 后，组件不会一次性加载全部数据，而是在滚动过程中通过 `lazy-load` 事件通知当前需要加载的数据区间。配合 `step` 可实现分页加载：

- `step` 为每页条目数，`lazy-load` 会按页触发。
- `step` 为 `0` 时，以当前渲染范围触发。

### autoSize

当容器尺寸不固定或需要根据内容自适应时，开启 `autoSize` 会在内容变化后自动调整容器宽高。注意：开启后容器会基于初始渲染尺寸进行收缩，建议在需要紧凑布局时使用。

### appendOnly

`appendOnly` 适合聊天记录、日志流等场景。开启后，滚动方向为向下/向右时只追加新项，不会回收旧项，避免频繁移除 DOM 导致的性能抖动。反向滚动时行为与常规虚拟列表一致。

### orientation

- `vertical`：纵向虚拟滚动（默认）。
- `horizontal`：横向虚拟滚动，需配合 `columns` 或确保 `items` 为横向数据。
- `both`：双向虚拟滚动，`itemSize` 必须为数组，`items` 视为二维数据。

### showLoader 与 loaderDisabled

- `showLoader`：在滚动加载过程中显示加载占位。
- `loaderDisabled`：仅保留加载占位容器，内部不渲染默认加载图标，可通过 `loader` 插槽自定义。

## FAQ

### 列表项高度不固定怎么办？

当前 `VirtualList` 基于固定 `itemSize` 进行计算。若项高不固定，建议先给出接近平均值的 `itemSize`，并通过 `numToleratedItems` 增加缓冲。若差异较大，可考虑使用 `autoSize` 或在外部处理尺寸反馈。
