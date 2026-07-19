# ImageCompare 图片对比

用于并排对比两张图片的差异，常用于展示修图前后、设计稿对比等场景。

## 何时使用

- 需要直观对比两张图片的差异时。
- 需要让用户通过拖拽滑块查看对比结果时。

## 基础用法

:::demo 通过 `before` 和 `after` 传入两张图片地址，即可使用默认的滑块进行对比。

image-compare/basic

:::

## 受控模式

:::demo 通过 `v-model:value` 控制滑块位置，实现受控对比。

image-compare/controlled

:::

## 禁用状态

:::demo 设置 `disabled` 后，滑块将不可拖动。

image-compare/disabled

:::
