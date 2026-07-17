# Tag 标签

进行标记和分类的小标签。

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

## 基本用法

:::demo 基本标签的用法，可以通过添加 `closable` 变为可关闭标签。可关闭标签具有 `close` 两个事件。

tag/basic

:::

## 可选择标签

:::demo 可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。 > 该组件为完全受控组件，不支持非受控用法。

tag/checkable

:::

## 多彩标签

:::demo 我们添加了多种预设色彩的标签样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。

tag/colorful

:::

## 动态添加和删除

:::demo 用数组生成一组标签，可以动态添加和删除。

tag/control

:::

## 热门标签

:::demo 选择你感兴趣的话题。

tag/hot-tags

:::

## 图标按钮

:::demo 当需要在 `Tag` 内嵌入 `Icon` 时，可以设置 `icon` 属性，或者直接在 `Tag` 内使用 `Icon` 组件。 如果想控制 `Icon` 具体的位置，只能直接使用 `Icon` 组件，而非 `icon` 属性。

tag/icon

:::

## 无边框

:::demo 无边框模式。

tag/border-less

:::

## 预设状态的标签

:::demo 预设五种状态颜色，可以通过设置 `color` 为 `success`、 `processing`、`error`、`default`、`warning` 来代表不同的状态。

tag/status

:::

## API

### Tag

| 参数      | 说明             | 类型    | 默认值 | 版本 |
| --------- | ---------------- | ------- | ------ | ---- |
| closable  | 标签是否可以关闭 | boolean | false  |      |
| closeIcon | 自定义关闭按钮   | VNode \ | slot   | -    | 2.0.0 |
| color     | 标签色           | string  | -      |      |
| icon      | 设置图标         | VNode \ | slot   | -    | 2.0.0 |
| bordered  | 是否有边框       | boolean | `true` | 4.x  |

### 事件

| 事件名称 | 说明         | 回调参数    |
| -------- | ------------ | ----------- |
| close    | 关闭时的回调 | (e) => void |

### Tag.CheckableTag

| 参数             | 说明               | 类型    | 默认值 |
| ---------------- | ------------------ | ------- | ------ |
| checked(v-model) | 设置标签的选中状态 | boolean | false  |

### 事件

| 事件名称 | 说明                 | 回调参数          |
| -------- | -------------------- | ----------------- |
| change   | 点击标签时触发的回调 | (checked) => void |
