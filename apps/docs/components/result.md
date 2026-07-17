# Result 结果

用于反馈一系列操作任务的处理结果。

## 何时使用

当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。

## Success

:::demo 成功的结果。

result/success

:::

## Info

:::demo 展示处理结果。

result/info

:::

## Warning

:::demo 警告类型的结果。

result/warning

:::

## 403

:::demo 你没有此页面的访问权限。

result/403

:::

## 404

:::demo 此页面未找到。

result/404

:::

## 500

:::demo 服务器发生了错误。

result/500

:::

## Error

:::demo 复杂的错误反馈。

result/error

:::

## 自定义 icon

:::demo 自定义 icon。

result/customIcon

:::

## API

| 参数 | 说明 | 类型 | 默认值 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| extra | 操作区 | slot | - |  |  |  |  |  |  |
| icon | 自定义 icon | slot | - |  |  |  |  |  |  |
| status | 结果的状态,决定图标和颜色 | `success` \ | `error` \ | `info` \ | `warning` \ | `404` \ | `403` \ | `500` | 'info' |
| subTitle | subTitle 文字 | string \ | VNode \ | slot | - |  |  |  |  |  |  |
| title | title 文字 | string \ | VNode \ | slot | - |  |  |  |  |  |  |
