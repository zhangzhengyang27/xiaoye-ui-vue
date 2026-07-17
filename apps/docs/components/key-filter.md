# KeyFilter 按键过滤器

通过预设或自定义正则，对输入框的按键进行过滤，限制用户可输入的字符集。

## 何时使用

- 需要限制输入框只能输入数字、字母、十六进制等特定字符的场景。
- 表单字段（如金额、邮箱、账号、slug）需要按字符集做即时约束。
- 不希望替换组件，仅希望在原生 `input` 或 `xy-input` 之上叠加过滤能力的场景。

## 基础用法

:::demo 使用 `preset="pint"` 限制输入框只能输入数字字符，其他按键将被拦截。KeyFilter 会自动查找子树中的 `input` / `textarea` 元素作为过滤目标。

key-filter/basic

:::

## 内置预设

:::demo KeyFilter 内置 9 种预设：`pint`（正整数）、`int`（整数）、`pnum`（正数）、`money`（金额）、`num`（数字）、`hex`（十六进制）、`email`（邮箱字符）、`alpha`（字母）、`alphanum`（字母数字），覆盖常见输入场景。

key-filter/preset

:::

## 自定义正则

:::demo 当内置预设不满足需求时，可通过 `pattern` 属性传入自定义正则。正则需匹配单个允许字符（例如 `/[a-z]/` 表示仅允许小写字母）。

key-filter/custom-pattern

:::

## 仅验证模式

:::demo 默认模式下非法按键会被阻止；设置 `validate-only` 后不会阻止输入，但内部仍会按预设校验整体值，便于配合自定义错误提示与业务校验。

key-filter/validate-only

:::

## 与 Input 组件集成

:::demo KeyFilter 会自动查找子树中的 `input` / `textarea` 元素作为过滤目标，因此可以直接包裹 `xy-input` 组件使用，无需改变原有表单结构。

key-filter/with-input

:::

## API

### KeyFilter Props

| 属性         | 说明                                              | 类型    | 默认值  |
| ------------ | ------------------------------------------------- | ------- | ------- |
| preset       | 预设名，可选值见下表                              | string  | -       |
| pattern      | 自定义正则，匹配单个允许字符。优先级高于 `preset` | RegExp  | -       |
| validateOnly | 是否仅验证模式（不阻止按键）                      | boolean | `false` |

> `preset` 与 `pattern` 二选一；若同时设置，`pattern` 优先。

### 内置预设

| 预设名     | 说明     | 允许字符                 |
| ---------- | -------- | ------------------------ |
| `pint`     | 正整数   | `0-9`                    |
| `int`      | 整数     | `0-9` `-`                |
| `pnum`     | 正数     | `0-9` `.`                |
| `money`    | 金额     | `0-9` `.` 空格 `,`       |
| `num`      | 数字     | `0-9` `.` `-`            |
| `hex`      | 十六进制 | `0-9` `a-f` `A-F`        |
| `email`    | 邮箱字符 | 字母数字 `_` `.` `-` `@` |
| `alpha`    | 字母     | 字母 `_`                 |
| `alphanum` | 字母数字 | 字母数字 `_`             |

### 用法说明

```vue
<template>
  <!-- 包裹原生 input -->
  <xy-key-filter preset="pint">
    <input v-model="value" />
  </xy-key-filter>

  <!-- 包裹 xy-input 组件 -->
  <xy-key-filter preset="money">
    <xy-input v-model:value="amount" />
  </xy-key-filter>

  <!-- 使用自定义正则 -->
  <xy-key-filter :pattern="/[a-z0-9-]/i">
    <xy-input v-model:value="slug" />
  </xy-key-filter>
</template>
```

## FAQ

### `pattern` 与 `preset` 同时设置时以哪个为准？

`pattern` 优先级更高。当传入 `pattern` 时，`preset` 将被忽略。

### 为什么 `validate-only` 模式下仍能输入非法字符？

`validate-only` 的设计目的是「不阻止用户操作，仅做整体值校验」，便于结合表单错误提示使用。如需阻止输入，请使用默认模式。
