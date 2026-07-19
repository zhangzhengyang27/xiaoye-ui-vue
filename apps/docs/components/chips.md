# Chips 标签输入

用于输入和管理一组标签，支持回车、粘贴、分隔符批量输入。

## 何时使用

- 需要用户输入多个标签、关键词时。
- 需要展示并允许删除一组简短标签时。

## 基础用法

:::demo 输入文本后按回车添加标签，点击 × 删除。

chips/basic

:::

## 分隔符批量输入

:::demo 设置 `separator` 后，可通过粘贴或输入分隔符批量添加标签。

chips/separator

:::

## 最大数量限制

:::demo 设置 `max` 限制最多可输入的标签数量。

chips/max

:::

## 禁用状态

:::demo 设置 `disabled` 后，标签输入框不可用。

chips/disabled

:::

## API

### Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| addOnBlur | 是否在失去焦点时自动将输入内容添加为标签 | boolean | `false` |  |
| allowDuplicate | 是否允许添加重复标签 | boolean | `true` |  |
| disabled | 是否禁用标签输入 | boolean | `false` |  |
| max | 最多允许输入的标签数量 | number | - |  |
| placeholder | 输入框占位文本 | string | - |  |
| prefixCls | 自定义样式前缀类名，通常无需设置 | string | - |  |
| separator | 分隔符，支持字符串或正则表达式。设置后输入该字符或粘贴包含该分隔符的文本时会自动拆分并批量添加标签 | string \| RegExp | - |  |
| value(v-model) | 当前标签列表 | string[] | - |  |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| add | 添加标签时触发 | `{ originalEvent: Event, value: string[] }` |  |
| blur | 输入框失去焦点时触发 | `(event: FocusEvent) => void` |  |
| focus | 输入框获得焦点时触发 | `(event: FocusEvent) => void` |  |
| remove | 删除标签时触发 | `{ originalEvent: Event, value: string }` |  |
| update:value | 标签列表变化时触发（用于 `v-model`） | `(value: string[]) => void` |  |

### 方法

通过 `ref` 可调用 Chips 实例上的方法：

| 名称 | 说明 | 版本 |
| --- | --- | --- |
| addItem | 手动添加一个标签，参数为 `(event: Event, item: string, preventDefault?: boolean)` |  |
| input | 内部输入框元素的引用 |  |
| inputValue | 当前输入框中的值 |  |
| removeItem | 手动删除指定索引的标签，参数为 `(event: Event, index: number)` |  |

### 插槽

| 插槽名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| chip | 自定义单个标签的内容 | `{ value: string, index: number, removeCallback: (event: Event) => void }` |  |
| default | 默认插槽 | - |  |
| removeIcon | 自定义删除图标 | - |  |

## 类型定义

```ts
import type { ChipsProps } from 'xiaoye-ui/chips';
```

`ChipsProps` 由 `chipsProps()` 推导而来，包含上述所有 Props 的可选类型定义。

## 使用说明

### separator

`separator` 支持字符串或正则表达式：

- 传入字符串时，例如 `separator=","`，输入 `,` 或粘贴 `a,b,c` 会拆分为三个标签。
- 传入正则表达式时，例如 `:separator="/[,;]/"`，输入 `,` 或 `;` 都会触发拆分，粘贴内容也会按正则拆分。

### max

设置 `max` 后，当标签数量达到上限时，输入框会自动禁用，用户无法再输入新标签，但可以通过 Backspace 删除已有标签。

### allowDuplicate

默认允许添加重复标签。设置为 `false` 后，输入或粘贴已存在的标签时会被自动忽略。

### addOnBlur

设置为 `true` 后，当输入框失去焦点时，会自动将当前输入内容作为新标签添加（空内容不会添加）。
