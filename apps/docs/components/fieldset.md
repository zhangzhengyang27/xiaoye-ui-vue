# Fieldset 字段集

Fieldset 基于 HTML `<fieldset>` 元素封装，用于将一组相关字段（如表单字段、描述信息）以带 legend 标题的边框分组展示。支持可切换折叠、自定义 legend 与切换图标。

## 何时使用

- 表单中需要将字段按业务含义分组（如「基本信息」「联系地址」「权限设置」）时。
- 需要将一组相关内容用边框与标题进行视觉分组时。
- 需要可折叠的字段分组，按需展开 / 收起以减少信息密度时。

## 基础用法

:::demo 通过 `legend` 设置标题文字，fieldset 会渲染带标题的边框分组，常用于表单分组与描述信息展示。

fieldset/basic

:::

## 可切换

:::demo 设置 `toggleable` 后，legend 区域变为可点击按钮，点击 + / - 图标可切换内容显隐。支持通过 `v-model:collapsed` 受控使用，未传值时为非受控模式。

fieldset/toggleable

:::

## 切换按钮属性

:::demo 通过 `toggleButtonProps` 可向切换按钮透传任意属性（如 `aria-label`、自定义 `class`），便于无障碍标注或样式定制。

fieldset/with-toggle-button

:::

## 操作按钮

:::demo 通过 `legend` 插槽可完全自定义 legend 区域，在标题旁放置重置、复制等操作按钮。插槽参数提供 `toggleCallback` 用于触发折叠切换。

fieldset/with-actions

:::

## 自定义 legend

:::demo `legend` 插槽支持图标、标签等任意内容；`toggleicon` 插槽可自定义切换图标（如用文字替代默认 + / -），插槽参数包含 `collapsed` 与 `class`。

fieldset/custom-legend

:::

## API

### Fieldset Props

| 属性              | 说明                                                  | 类型    | 默认值  |
| ----------------- | ----------------------------------------------------- | ------- | ------- |
| legend            | 字段集标题文本                                        | string  | -       |
| toggleable        | 是否可切换折叠                                        | boolean | `false` |
| collapsed         | 当前折叠状态（支持 `v-model:collapsed`）              | boolean | `false` |
| toggleButtonProps | 透传给切换按钮的属性对象，如 `aria-label`、`class` 等 | object  | -       |

### Fieldset Slots

| 插槽名      | 说明                                       | 作用域参数             |
| ----------- | ------------------------------------------ | ---------------------- |
| default     | 字段集内容                                 | -                      |
| legend      | 自定义 legend 区域，可放置图标、操作按钮等 | `{ toggleCallback }`   |
| toggleicon  | 自定义切换图标                             | `{ collapsed, class }` |
| togglericon | 同 `toggleicon`，兼容别名                  | `{ collapsed, class }` |

### Fieldset Events

| 事件名           | 说明               | 回调参数                   |
| ---------------- | ------------------ | -------------------------- |
| update:collapsed | 折叠状态变化时触发 | `(value: boolean)`         |
| toggle           | 切换折叠状态时触发 | `{ originalEvent, value }` |

### Fieldset Methods

通过 ref 可调用以下方法：

| 名称             | 说明                                   |
| ---------------- | -------------------------------------- |
| toggle(event)    | 切换折叠状态                           |
| onKeyDown(event) | 处理键盘事件（Enter / Space 触发切换） |

### 无障碍

- 当 `toggleable` 为 `true` 时，legend 渲染为 `button`，具备 `aria-controls`、`aria-expanded` 属性。
- 内容区域有 `role="region"`，通过 `aria-labelledby` 关联标题。
- 切换按钮支持键盘 Enter / Space 触发。
