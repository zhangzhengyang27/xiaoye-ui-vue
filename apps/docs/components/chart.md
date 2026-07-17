# Chart 图表

基于 [Chart.js v4](https://www.chartjs.org/) 封装的图表组件，支持折线图、柱状图、饼图、环形图、雷达图、极坐标图等常见类型。

## 何时使用

- 需要在页面中展示数据可视化图表。
- 需要支持折线、柱状、饼图等多种图表类型切换。
- 需要对图表数据进行响应式更新。

## 基础用法

:::demo 通过 `type` 指定图表类型为 `line`，`data` 传入 Chart.js 数据结构（包含 `labels` 与 `datasets`）。`options` 透传 Chart.js 配置项。

chart/line

:::

## 柱状图

:::demo 设置 `type` 为 `bar` 展示柱状图，可同时传入多组 `datasets` 进行分组对比。

chart/bar

:::

## 饼图

:::demo 设置 `type` 为 `pie` 展示饼图，`backgroundColor` 通过数组为每个扇区指定颜色。

chart/pie

:::

## 环形图

:::demo 设置 `type` 为 `doughnut` 展示环形图，通过 `options.cutout` 控制中心镂空比例。

chart/doughnut

:::

## 雷达图

:::demo 设置 `type` 为 `radar` 展示雷达图，常用于多维度指标对比。

chart/radar

:::

## 极坐标图

:::demo 设置 `type` 为 `polarArea` 展示极坐标图，适合展示带角度分布的数据。

chart/polar-area

:::

## API

### Chart Props

| 属性         | 说明                                    | 类型                 | 默认值 |
| ------------ | --------------------------------------- | -------------------- | ------ |
| type         | 图表类型，对应 Chart.js 的 type         | string               | -      |
| data         | 图表数据，对应 Chart.js 的 ChartData    | object               | -      |
| options      | 图表配置，对应 Chart.js 的 ChartOptions | object               | -      |
| plugins      | 图表插件数组                            | any[]                | -      |
| width        | 画布宽度（像素）                        | number               | 300    |
| height       | 画布高度（像素）                        | number               | 150    |
| canvas-props | 透传至 `<canvas>` 的原生属性            | CanvasHTMLAttributes | null   |

### Chart Events

| 事件名 | 说明                   | 回调参数                              |
| ------ | ---------------------- | ------------------------------------- |
| select | 点击图表元素时触发     | ({ originalEvent, element, dataset }) |
| loaded | 图表实例创建完成后触发 | (chart: Chart)                        |

### Chart Methods

通过 ref 可调用以下方法：

| 方法名         | 说明                              | 返回值                    |
| -------------- | --------------------------------- | ------------------------- |
| getCanvas      | 获取 canvas DOM 元素              | HTMLCanvasElement \| null |
| getChart       | 获取 Chart.js 实例                | Chart \| null             |
| getBase64Image | 导出图表为 base64 图片            | string \| null            |
| refresh        | 刷新图表（调用 `chart.update()`） | void                      |
| reinit         | 重新初始化图表                    | void                      |
| generateLegend | 生成图例 HTML                     | string \| null            |

## 备注

- 组件内部通过动态 `import('chart.js/auto')` 加载 Chart.js，需确保项目已安装 `chart.js` 依赖。
- `data`、`type`、`options` 变化时组件会自动重新初始化图表。
- 点击图表元素会触发 `select` 事件，可通过 `element` 与 `dataset` 获取点击详情。
- 图表实例仅在浏览器端创建，支持 SSR 场景（服务端不渲染图表）。
- 完整配置项请参考 [Chart.js 官方文档](https://www.chartjs.org/docs/latest/)。
