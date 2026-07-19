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
