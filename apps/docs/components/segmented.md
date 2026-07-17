# Segmented 分段控制器

分段控制器。

## 何时使用

- 用于展示多个选项并允许用户选择其中单个选项；
- 当切换选中选项时，关联区域的内容会发生变化。

## 基本用法

:::demo 最简单的用法。

segmented/basic

:::

## Block分段控制器

:::demo `block` 属性使其适合父元素宽度。

segmented/block

:::

## 不可用

:::demo Segmented 不可用。

segmented/disabled

:::

## 自定义渲染

:::demo 自定义渲染每一个 Segmented Item。

segmented/custom

:::

## 动态数据

:::demo 动态加载数据。

segmented/dynamic

:::

## 三种大小

:::demo 我们为 `<xy-segmented />` 组件定义了三种尺寸（大、默认、小），高度分别为 `40px`、`32px` 和 `24px`。

segmented/size

:::

## API

### Segmented

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将宽度调整为父元素宽度的选项 | boolean | - |  |
| disabled | 是否禁用 | boolean | false |  |
| options | 数据化配置选项内容 | string[] \ | number[] \ | SegmentedOption[] | [] |  |
| size | 控件尺寸 | `large` \ | `middle` \ | `small` | - |  |
| value | 当前选中的值 | string \ | number |  |  |
| label | 使用插槽自定义 label | v-slot:label="SegmentedBaseOption" |  |  |

### 事件

| 事件名称 | 说明                 | 回调参数                 |         |
| -------- | -------------------- | ------------------------ | ------- |
| change   | 选项变化时的回调函数 | function(value: string \ | number) | -   |

#### SegmentedBaseOption、SegmentedOption

```ts
interface SegmentedBaseOption {
  value: string | number;
  disabled?: boolean;
  payload?: any; // payload more data
  /**
   * html `title` property for label
   */
  title?: string;
  className?: string;
}
interface SegmentedOption extends SegmentedBaseOption {
  label?: VueNode | ((option: SegmentedBaseOption) => VueNode);
}
```
