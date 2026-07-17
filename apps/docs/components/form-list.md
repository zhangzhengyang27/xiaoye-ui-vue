# FormList 动态表单列表

用于管理表单中动态增删的列表字段。通过作用域插槽提供 `fields`、`add`、`remove`、`move` 等操作方法，并自动将列表数据同步到 `xy-form` 的表单模型中。

## 何时使用

- 表单中存在数量可变的同类字段（如多个用户、多个邮箱、多个联系方式）。
- 需要动态添加、删除、排序表单项的场景。
- 每个列表项内包含多个子字段（嵌套表单）的场景。

## 基础用法

:::demo `xy-form-list` 必须置于 `xy-form` 内使用。通过 `name` 指定字段名，默认插槽接收 `{ fields, add, remove }`。`fields` 为字段数组，每项包含 `key`（唯一标识）和 `name`（索引）。

form-list/basic

:::

## 添加 / 删除 / 移动

:::demo 插槽还提供 `add(defaultValue, insertIndex?)`、`remove(index)`、`move(from, to)` 三个方法。`add` 第二个参数可指定插入位置，省略时追加到末尾。

form-list/add-remove

:::

## 初始值

:::demo 通过 `initial-value` 属性可初始化列表字段。需要重置为初始值时，可通过改变组件的 `key` 强制重建实例。

form-list/initial-value

:::

## 表单验证

:::demo 与普通表单项一致，通过 `xy-form-item` 的 `name` 和 `rules` 配置校验规则。name 需使用 `[listName, index, field]` 的数组形式定位字段，调用 `form.validate()` 即可触发校验。

form-list/validation

:::

## 嵌套表单

:::demo 每个列表项可包含多个子字段。在 `xy-form-item` 内嵌套多个 `xy-form-item`，并通过 `[listName, index, subField]` 定位每个子字段，即可构建嵌套结构的动态表单。

form-list/nested

:::

## API

### FormList Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 字段名，支持字符串、数字或路径数组 | string \| number \| (string \| number)[] | - |
| initialValue | 列表初始值 | any[] | - |

### FormList Slots

| 插槽名  | 说明           | 插槽参数                        |
| ------- | -------------- | ------------------------------- |
| default | 渲染列表项内容 | `{ fields, add, remove, move }` |

### 插槽参数

```ts
interface FormListField {
  key: string; // 唯一标识，作为 v-for 的 key
  name: number; // 字段索引
  isListField: true; // 内部标识
}

interface FormListOperation {
  // 添加项；insertIndex 省略时追加到末尾
  add: (defaultValue?: any, insertIndex?: number) => void;
  // 删除指定索引的项
  remove: (index: number) => void;
  // 移动项
  move: (from: number, to: number) => void;
}
```

### 用法说明

```vue
<template>
  <xy-form :model="formState">
    <xy-form-list name="users">
      <template #default="{ fields, add, remove }">
        <xy-form-item
          v-for="(field, index) in fields"
          :key="field.key"
          :label="`用户 ${index + 1}`"
          :name="['users', index, 'name']"
        >
          <xy-input v-model:value="formState.users[index].name" />
          <xy-button v-if="fields.length > 1" @click="remove(index)">删除</xy-button>
        </xy-form-item>
        <xy-button type="dashed" @click="add({ name: '' })">添加用户</xy-button>
      </template>
    </xy-form-list>
  </xy-form>
</template>
```

## FAQ

### 为什么必须放在 `xy-form` 内使用？

FormList 依赖 `xy-form` 提供的表单上下文（`useInjectForm`），需要将列表数据同步到表单模型中以便校验和提交。脱离 `xy-form` 时仍可使用 `fields` / `add` / `remove` / `move`，但不会同步到表单模型。

### `fields` 中 `key` 和 `name` 的区别？

`key` 是稳定的唯一标识，必须作为 `v-for` 的 `:key`，避免增删时组件状态错乱；`name` 是当前项在列表中的索引（0、1、2...），用于在 `xy-form-item` 的 `name` 中定位字段路径。

### 如何重置 FormList 为初始值？

FormList 的 `initial-value` 仅在初始化时生效。如需重置，可通过改变组件的 `key` 强制重建实例（参考「初始值」示例），或调用 `form.resetFields()` 配合外部状态管理。
