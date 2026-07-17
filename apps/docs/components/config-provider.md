# ConfigProvider 全局化配置

为组件提供统一的全局化配置。

## 使用

ConfigProvider 使用 Vue 的 [provide / inject](https://vuejs.org/v2/api/#provide-inject) 特性，只需在应用外围包裹一次即可全局生效。

```html
<template>
  <xy-config-provider :getPopupContainer="getPopupContainer">
    <app />
  </xy-config-provider>
</template>
<script>
  export default {
    methods: {
      getPopupContainer(el, dialogContext) {
        if (dialogContext) {
          return dialogContext.getDialogWrap();
        } else {
          return document.body;
        }
      },
    },
  };
</script>
```

### Content Security Policy

部分组件为了支持波纹效果，使用了动态样式。如果开启了 Content Security Policy (CSP)，你可以通过 `csp` 属性来进行配置：

```html
<xy-config-provider :csp="{ nonce: 'YourNonceCode' }">
  <xy-button>My Button</xy-button>
</xy-config-provider>
```

## 国际化

:::demo 此处列出 Xiaoye UI 中需要国际化支持的组件，你可以在演示里切换语言。

config-provider/locale

:::

## 方向

:::demo 这里列出了支持 `rtl` 方向的组件，您可以在演示中切换方向。

config-provider/direction

:::

## 组件尺寸

:::demo 修改默认组件尺寸。

config-provider/size

:::

## 主题

:::demo 通过 theme 修改主题。

config-provider/theme

:::

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoInsertSpaceInButton | 设置为 `false` 时，移除按钮中 2 个汉字之间的空格 | boolean | true |  |
| componentSize | 设置 xiaoye-ui 组件大小 | `small` \ | `middle` \ | `large` | - | 3.0 |
| csp | 设置 [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 配置 | \{ nonce: string \} | - |  |
| direction | 设置文本展示方向。 [示例](#components-config-provider-demo-direction) | `ltr` \ | `rtl` | `ltr` | 3.0 |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。`false` 时会关闭虚拟滚动 | boolean \ | number | - |  |
| form | 设置 Form 组件的通用属性 | \{ validateMessages?: [ValidateMessages](/components/form/#validatemessages), requiredMark?: boolean \ | `optional`, colon?: boolean\} | - | 3.0 |
| getPopupContainer | 弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。 | Function(triggerNode, dialogContext) | () => document.body |  |
| getTargetContainer | 配置 Affix、Anchor 滚动监听容器。 | () => HTMLElement | () => window | 3.0 |
| input | 设置 Input 组件的通用属性 | \{ autocomplete?: string \} | - | 3.0 |
| locale | 语言包配置，语言包可到 [xiaoye-ui/es/locale](http://unpkg.com/xiaoye-ui/es/locale/) 目录下寻找 | object | - | 1.5.0 |
| pageHeader | 统一设置 pageHeader 的 ghost，参考 [pageHeader](<(/components/page-header)>) | \{ ghost: boolean \} | 'true' | 1.5.0 |
| prefixCls | 设置统一样式前缀。注意：需要配合 `less` 变量 `@xy-prefix` 使用 | string | `xy` |  |
| renderEmpty | 自定义组件空状态。参考 [空状态](/components/empty/) | slot \ | Function(componentName: string): VNode | - |  |
| space | 设置 Space 的 `size`，参考 [Space](/components/space) | \{ size: `small` \ | `middle` \ | `large` \ | `number` \} | - | 3.0 |
| transformCellText | Table 数据渲染前可以再次改变，一般用户空数据的默认配置 | Function(\{ text, column, record, index \}) => any | - | 1.5.4 |
| virtual | 设置 `false` 时关闭虚拟滚动 | boolean | - | 3.0 |
| wave | 设置水波纹特效 | \{ disabled?: boolean \} | - | 4.0.7 |

### ConfigProvider.config() `3.0.0+`

设置 `Modal`、`Message`、`Notification` rootPrefixCls。

```jsx
ConfigProvider.config({
  prefixCls: 'ant',
});
```

or

```jsx
// 如下配置支持响应式数据，你可以通过 prefixCls.value = 'other' 直接改变
const prefixCls = ref('ant');
ConfigProvider.config({
  prefixCls,
});
```

## FAQ

#### 为什么我使用了 ConfigProvider `locale`，时间类组件的国际化还有问题？

请检查是否设置了 `dayjs.locale('zh-cn')`，或者是否有两个版本的 dayjs 共存。

#### 配置 `getPopupContainer` 导致 Modal 报错？

当如下全局设置 `getPopupContainer` 为触发节点的 parentNode 时，由于 Modal 的用法不存在 `triggerNode`，这样会导致 `triggerNode is undefined` 的报错，需要增加一个判断条件。

```diff
 <ConfigProvider
-  getPopupContainer={triggerNode => triggerNode.parentNode}
+  getPopupContainer={node => {
+    if (node) {
+      return node.parentNode;
+    }
+    return document.body;
+  }}
 >
   <App />
 </ConfigProvider>
```

#### 为什么 message.info、notification.open 或 Modal.confirm 等方法内的 VueNode 无法继承 ConfigProvider 的属性？比如 `prefixCls` 和 `theme`。

静态方法是使用 Vue.render 重新渲染一个 Vue 根节点上，和主应用的 Vue 节点是脱离的。
