# Modal 对话框

模态对话框。

## 何时使用

需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 `Modal` 在当前页面正中打开一个浮层，承载相应的操作。

另外当需要一个简洁的确认框询问用户时，可以使用 `Modal.confirm()` 等语法糖方法。

## 基本用法

:::demo 第一个对话框。

modal/basic

:::

## 全屏

:::demo 使用样式定义一个全屏弹窗

modal/fullscreen

:::

## 异步关闭

:::demo 点击确定后异步关闭对话框，例如提交表单。

modal/async

:::

## 自定义页脚

:::demo 更复杂的例子，自定义了页脚的按钮，点击提交后进入 loading 状态，完成后关闭。 不需要默认确定取消按钮时，你可以把 `footer` 设为 `null`。

modal/footer

:::

## 确认对话框

:::demo 使用 `confirm()` 可以快捷地弹出确认框。

modal/confirm

:::

## 信息提示

:::demo 各种类型的信息提示，只提供一个按钮用于关闭。

modal/info

:::

## 国际化

:::demo 设置 `okText` 与 `cancelText` 以自定义按钮文字。

modal/locale

:::

## 手动更新和移除

:::demo 手动更新和关闭 `Modal.method` 方式创建的对话框。

modal/manual

:::

## 自定义位置

:::demo 使用 `centered` 或类似 `style.top` 的样式来设置对话框位置。

modal/position

:::

## 销毁确认对话框

:::demo 使用 `Modal.destroyAll()` 可以销毁弹出的确认窗。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题。

modal/confirm-router

:::

## 确认对话框(promise)

:::demo 使用 `confirm()` 可以快捷地弹出确认框。onCancel/onOk 返回 promise 可以延迟关闭

modal/confirm-promise

:::

## 自定义模态的宽度

:::demo 使用`width`来设置模态对话框的宽度

modal/width

:::

## 自定义页脚按钮属性

:::demo 传入 `okButtonProps` 和 `cancelButtonProps` 可分别自定义确定按钮和取消按钮的 props。

modal/button-props

:::

## 使用useModal获取上下文

:::demo 通过 `Modal.useModal` 创建支持读取 context 的 `contextHolder`。

modal/hook-modal

:::

## 自定义渲染对话框

:::demo 自定义渲染对话框, 可通过 `vueuse` 来实现拖拽。

modal/modal-render

:::

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | function | - |  |
| bodyStyle | Modal body 样式 | object | \{\} |  |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button/#api) | - |  |
| cancelText | 取消按钮文字 | string\ | slot | 取消 |  |
| centered | 垂直居中展示 Modal | boolean | `false` |  |
| closable | 是否显示右上角的关闭按钮 | boolean | true |  |
| closeIcon | 自定义关闭图标 | VNode \ | slot | - |  |
| confirmLoading | 确定按钮 loading | boolean | - |  |
| destroyOnClose | 关闭时销毁 Modal 里的子元素 | boolean | false |  |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `:footer="null"` | string\ | slot | 确定取消按钮 |  |
| forceRender | 强制渲染 Modal | boolean | false |  |
| getContainer | 指定 Modal 挂载的 HTML 节点 | (instance): HTMLElement | () => document.body |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |  |
| mask | 是否展示遮罩 | boolean | true |  |
| maskClosable | 点击蒙层是否允许关闭 | boolean | true |  |
| maskStyle | 遮罩样式 | object | \{\} |  |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button/#api) | - |  |
| okText | 确认按钮文字 | string\ | slot | 确定 |  |
| okType | 确认按钮类型 | string | primary |  |
| title | 标题 | string\ | slot | - |  |
| open(v-model) | 对话框是否可见 | boolean | - |  |
| width | 宽度 | string\ | number | 520 |  |
| wrapClassName | 对话框外层容器的类名 | string | - |  |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 |  |

### 事件

| 事件名称 | 说明                                 | 回调参数    |
| -------- | ------------------------------------ | ----------- |
| cancel   | 点击遮罩层或右上角叉或取消按钮的回调 | function(e) |
| ok       | 点击确定回调                         | function(e) |

#### 注意

> `<Modal />` 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 `destroyOnClose`。

### Modal.method()

包括：

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

以上均为一个函数，参数为 object，具体属性如下：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| appContext | 弹窗的上下文，一般用于获取全局注册组件、vuex 等内容 | - | - |  |
| autoFocusButton | 指定自动获得焦点的按钮 | `null` \ | `ok` \ | `cancel` | `ok` |  |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button) | - |  |
| cancelText | 取消按钮文字 | string | 取消 |  |
| centered | 垂直居中展示 Modal | boolean | `false` |  |
| class | 容器类名 | string | - |  |
| closable | 是否显示右上角的关闭按钮 | boolean | `false` |  |
| content | 内容 | string \ | VNode \ | function() | - |  |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `footer: null` | string \ | VNode \ | function() | - | 4.0.0 |
| icon | 自定义图标（1.14.0 新增） | VNode \ | ()=>VNode | - |  |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |  |
| mask | 是否展示遮罩 | boolean | true |  |
| maskClosable | 点击蒙层是否允许关闭 | boolean | `false` |  |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button) | - |  |
| okText | 确认按钮文字 | string | 确定 |  |
| okType | 确认按钮类型 | string | primary |  |
| title | 标题 | string\ | VNode \ | function() | - |  |
| width | 宽度 | string\ | number | 416 |  |
| wrapClassName | 对话框外层容器的类名 | string | - | 3.2.3 |
| zIndex | 设置 Modal 的 `z-index` | number | 1000 |  |
| onCancel | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function | - |  |
| onOk | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function | - |  |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

```jsx
const modal = Modal.info();

modal.update({
  title: '修改的标题',
  content: '修改的内容',
});

modal.destroy();
```

- `Modal.destroyAll`

使用 `Modal.destroyAll()` 可以销毁弹出的确认窗（即上述的 Modal.info、Modal.success、Modal.error、Modal.warning、Modal.confirm）。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题，而不用各处去使用实例的返回值进行关闭（modal.destroy() 适用于主动关闭，而不是路由这样被动关闭）

```jsx
const router = new VueRouter({ ... })

// router change
router.beforeEach((to, from, next) => {
  Modal.destroyAll();
})
```

### Modal.useModal()

当你需要使用 Context 时，可以通过 `Modal.useModal` 创建一个 `contextHolder` 插入子节点中。通过 hooks 创建的临时 Modal 将会得到 `contextHolder` 所在位置的所有上下文。创建的 `modal` 对象拥有与 [`Modal.method`](#modalmethod) 相同的创建通知方法。

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { Modal } from 'xiaoye-ui';
  const [modal, contextHolder] = Modal.useModal();

  modal.confirm({
    // ...
  });
</script>
```

## useDynamicModal 动态弹窗

`useDynamicModal` 是一个 composable，用于在 setup 函数中创建命令式调用的弹窗。与 `useModal` 不同，`useDynamicModal` 通过 `open(component, options)` 接收一个 Vue 组件作为弹窗内容，更适合需要渲染自定义组件（而非简单文本）的场景。

### 与 useModal 的区别

| 特性     | useModal                         | useDynamicModal                  |
| -------- | -------------------------------- | -------------------------------- |
| 调用方式 | `modal.info(config)` 等 5 种类型 | `modal.open(component, options)` |
| 内容类型 | 文本、VNode 或函数               | Vue 组件（可响应式更新 props）   |
| 适用场景 | 简单确认框、提示框               | 需要复杂组件交互的弹窗           |
| 实例方法 | `destroy`、`update`              | `destroy`、`update`              |

### 基础用法

:::demo 调用 `useDynamicModal()` 返回 `[modal, holder]` 元组。`holder` 是一个渲染函数，必须渲染到模板中（例如通过 `<holder />`）。通过 `modal.open(component, options)` 打开弹窗，`options.componentProps` 会作为 props 传给内容组件，`options.modalProps` 会传给底层 Modal 组件。

modal/dynamic-modal-basic

:::

### 模拟确认对话框

:::demo `useDynamicModal` 没有内置 info/success/error/warning/confirm 方法，但可以通过传入自定义组件实现类似效果。本示例展示如何用一个 ConfirmContent 组件配合不同的 `componentProps` 和 `modalProps` 实现五种类型的确认框。

modal/dynamic-modal-confirm

:::

### 动态更新

:::demo `modal.open()` 返回的实例包含 `update(options)` 和 `destroy()` 方法。`update` 可用于动态更新 `componentProps` 和 `modalProps`，实现弹窗内容和标题的实时变化。

modal/dynamic-modal-update

:::

### 自定义弹窗样式

:::demo 通过 `modalProps` 可以透传所有 [Modal](#api) 的属性，例如 `width`、`footer`、`mask`、`centered` 等，实现各种自定义样式。

modal/dynamic-modal-custom

:::

### API

#### useDynamicModal()

返回元组 `[modal, holder]`：

- `modal`: 对象，包含 `open(component, options)` 方法
- `holder`: Vue 渲染函数，必须渲染到模板中（例如 `<holder />`）

#### modal.open(component, options)

| 参数      | 说明         | 类型                | 默认值 |
| --------- | ------------ | ------------------- | ------ |
| component | 弹窗内容组件 | Component           | -      |
| options   | 配置项       | DynamicModalOptions | `{}`   |

#### DynamicModalOptions

| 属性           | 说明                    | 类型                | 默认值 |
| -------------- | ----------------------- | ------------------- | ------ |
| componentProps | 传给内容组件的 props    | Record<string, any> | `{}`   |
| modalProps     | 传给底层 Modal 的 props | [ModalProps](#api)  | `{}`   |

#### modal.open() 返回值

调用 `modal.open()` 返回 `{ destroy, update }` 实例：

| 方法            | 说明         | 参数                           |
| --------------- | ------------ | ------------------------------ |
| destroy()       | 销毁当前弹窗 | -                              |
| update(options) | 更新弹窗配置 | (options: DynamicModalOptions) |

## FAQ

### 为什么 Modal 方法不能获取 全局注册组件、context、vuex 等内容和 ConfigProvider `locale/prefixCls/theme` 配置， 以及不能响应式更新数据 ？

直接调用 Modal 方法，组件会通过 `Vue.render` 动态创建新的 Vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如使用全局注册的组件）时，可以通过 Modal.useModal 方法会返回 modal 实体以及 contextHolder 节点。将其插入到你需要获取 context 位置即可：

```html
<template>
  <contextHolder />
  <!-- <component :is='contextHolder'/> -->
</template>
<script setup>
  import { Modal } from 'xiaoye-ui';
  const [modal, contextHolder] = Modal.useModal();

  modal.confirm({
    // ...
  });
</script>
```

> 可通过 [App 包裹组件](/components/app-cn) 简化`useModal`等方法需要手动植入 contextHolder 的问题。
