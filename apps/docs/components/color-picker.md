# ColorPicker 颜色选择器

用于选择颜色的组件，支持 HEX、RGB、HSB 三种颜色格式，并可作为弹出面板或内联面板使用。

## 何时使用

- 需要让用户直观地选择颜色（例如主题色、标签颜色、画笔颜色等）。
- 表单中需要采集颜色值的场景。
- 需要在弹层或内联区域中呈现调色板的场景。

## 基础用法

:::demo 使用 `v-model` 绑定颜色值，点击预览框展开调色面板，拖动色块和色相滑块即可选择颜色。默认格式为 `hex`，绑定值为不带 `#` 的十六进制字符串。

color-picker/basic

:::

## 颜色格式

:::demo 通过 `format` 属性可切换输出格式：`hex` 输出字符串（如 `ff5252`），`rgb` 输出 `{ r, g, b }` 对象，`hsb` 输出 `{ h, s, b }` 对象。

color-picker/format

:::

## 内联模式

:::demo 设置 `inline` 属性后，调色面板将常驻显示，不再以弹出层形式展现，适合在设置面板等固定区域中使用。

color-picker/inline

:::

## 禁用状态

:::demo 设置 `disabled` 属性后，预览框变为不可交互状态，无法打开颜色面板。

color-picker/disabled

:::

## 事件处理

:::demo ColorPicker 提供 `change`、`show`、`hide` 等事件，可用于监听颜色变化与面板显隐状态。下方的日志面板会实时记录触发的事件。

color-picker/events

:::

## 多格式输出

:::demo 切换 hex / rgb / hsb 三种格式查看输出。

color-picker/formats

:::

## 预设色板

:::demo 自定义预设颜色快速选择。

color-picker/preset-colors

:::

## 在表单中使用

:::demo 作为表单字段使用。

color-picker/in-form

:::

## API

### ColorPicker Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 当前颜色值，类型随 `format` 变化 | string \| object | `null` |
| defaultValue | 非受控模式下的默认值 | string \| object | `null` |
| defaultColor | 无值时面板显示的初始颜色（不带 `#` 的 hex） | string | `'ff0000'` |
| format | 颜色输出格式 | `'hex'` \| `'rgb'` \| `'hsb'` | `'hex'` |
| inline | 是否内联显示（不弹出 overlay） | boolean | `false` |
| disabled | 是否禁用 | boolean | `false` |
| invalid | 是否为无效状态 | boolean | - |
| name | 表单 name 属性 | string | - |
| tabindex | 输入框 tabindex | string | `null` |
| appendTo | 面板挂载位置，可选 `'body'`、`'self'` 或 CSS 选择器 | string \| HTMLElement | `'body'` |
| inputId | 输入框 id，便于 label 关联 | string | `null` |
| autoZIndex | 是否自动管理 z-index | boolean | `true` |
| baseZIndex | z-index 基准值 | number | `0` |
| overlayClass | overlay 自定义样式类 | any | `null` |
| panelClass | （已废弃）面板样式类，请使用 `overlayClass` | any | `null` |

### ColorPicker Events

| 事件名            | 说明               | 回调参数                                    |
| ----------------- | ------------------ | ------------------------------------------- |
| change            | 颜色变化时触发     | `(e: { event: Event, value: any }) => void` |
| update:modelValue | `v-model` 同步事件 | `(value: any) => void`                      |
| value-change      | 颜色值变化时触发   | `(value: any) => void`                      |
| show              | 面板展开时触发     | `() => void`                                |
| hide              | 面板关闭时触发     | `() => void`                                |

### 类型定义

```ts
type ColorPickerFormat = 'hex' | 'rgb' | 'hsb';

interface ColorPickerHSBValue {
  h: number;
  s: number;
  b: number;
}

interface ColorPickerRGBValue {
  r: number;
  g: number;
  b: number;
}

interface ColorPickerChangeEvent {
  event: Event;
  value: any;
}
```

## FAQ

### 为什么 HEX 值不带 `#`？

为了与底层色值计算保持一致，ColorPicker 的 `hex` 格式输出不包含 `#` 前缀（例如 `1890ff`）。如需在样式属性中使用，可手动拼接 `#`。

### 如何将面板挂载到组件自身？

设置 `appendTo="self"`，面板将以相对定位渲染在组件内部，可用于防止跨容器裁剪。
