# ToggleButton 切换按钮

用于在两种或多种状态之间切换，可单独使用或作为选项组使用。

## 何时使用

- 需要在两种状态之间切换时。
- 需要从一组相关选项中选择一个或多个时。

## 基础用法

:::demo 作为开关使用，绑定布尔值。

toggle-button/basic

:::

## 选项组

:::demo 通过 `options` 传入选项列表，可作为单选按钮组使用。

toggle-button/options

:::

## 多选模式

:::demo 设置 `multiple` 后，可同时选中多个选项。

toggle-button/multiple

:::

## 禁用状态

:::demo 设置 `disabled` 后，整个选项组或单个选项不可用。

toggle-button/disabled

:::

## 使用说明

- 当没有传入 `options` 时，组件表现为一个开关按钮，此时 `value` 建议绑定 `boolean` 类型，可通过 `default` 插槽自定义内容、通过 `icon` 插槽自定义图标。
- 当传入 `options` 时，组件表现为选项按钮组。单选模式下点击某个选项会在选中和未选中（值为 `undefined`）之间切换；多选模式下 `value` 为数组，点击选项会添加或移除该选项值。
- `optionLabel`、`optionValue`、`optionDisabled` 既可以是字符串（表示选项对象中对应的字段名），也可以是函数（接收完整选项对象，返回对应的 label / value / disabled）。

## API

通过设置 ToggleButton 的属性来产生不同的切换按钮样式，推荐顺序为：`value` -> `options` -> `multiple` -> `disabled` -> `size`。

组件的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前选中的值，可使用 `v-model:value` 双向绑定 | `boolean \ | string \ | number \ | (string \ | number \ | boolean)[]` | - |  |
| defaultValue | 默认选中的值 | `boolean \ | string \ | number \ | (string \ | number \ | boolean)[]` | - |  |
| options | 选项组数据 | `ToggleButtonOption[]` | - |  |
| optionLabel | 指定选项 `label` 的字段名，或自定义函数返回 `label` | `string \ | ((option: any) => string)` | `'label'` |  |
| optionValue | 指定选项 `value` 的字段名，或自定义函数返回 `value` | `string \ | ((option: any) => any)` | `'value'` |  |
| optionDisabled | 指定选项 `disabled` 的字段名，或自定义函数返回 `disabled` | `string \ | ((option: any) => boolean)` | `'disabled'` |  |
| multiple | 是否支持多选 | `boolean` | `false` |  |
| disabled | 是否禁用整个组件 | `boolean` | - |  |
| size | 按钮尺寸 | `large \ | middle \ | small` | - |  |

### 事件

| 事件名称     | 说明                     | 回调参数               | 版本 |
| ------------ | ------------------------ | ---------------------- | ---- |
| change       | 选中值变化时触发         | `(value: any) => void` |      |
| update:value | `v-model:value` 同步事件 | `(value: any) => void` |      |

### 插槽

| 插槽名 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| default | 开关模式下的默认内容，覆盖 `icon` 和内部 `On/Off` 文案 | - |  |
| icon | 开关模式下自定义图标 | `{ value: any }` |  |
| option | 自定义选项渲染 | `{ option: ToggleButtonOption, index: number, selected: boolean }` |  |

## Types

从 `xiaoye-ui` 中导出以下类型：

```ts
import type { ToggleButtonProps, ToggleButtonOption } from 'xiaoye-ui';
```

- `ToggleButtonProps`：组件完整的 Props 类型。
- `ToggleButtonOption`：单个选项的数据结构。

```ts
interface ToggleButtonOption {
  label?: string;
  value: string | number | boolean;
  disabled?: boolean;
}
```
