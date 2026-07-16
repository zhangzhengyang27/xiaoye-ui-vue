# TimePicker 时间选择框

输入或选择时间的控件。

## 何时使用

当用户需要输入一个时间，可以点击标准输入框，弹出时间面板进行选择。

## 基本

:::demo 点击 TimePicker，然后可以在浮层中选择或者输入某一时间。

time-picker/basic

:::

## 附加内容

:::demo 在 TimePicker 选择框底部显示自定义的内容。

time-picker/addon

:::

## 12 小时制

:::demo 12 小时制的时间选择器，默认的 format 为 `h:mm:ss a`。

time-picker/12hours

:::

## 禁用

:::demo 禁用时间选择。

time-picker/disabled

:::

## 选择时分

:::demo TimePicker 浮层中的列会随着 `format` 变化，当略去 `format` 中的某部分时，浮层中对应的列也会消失。

time-picker/hide-column

:::

## 步长选项

:::demo 可以使用 `hourStep` `minuteStep` `secondStep` 按步长展示可选的时分秒。

time-picker/interval-options

:::

## 三种大小

:::demo 三种大小的输入框，大的用在表单中，中的为默认。

time-picker/size

:::

## 后缀图标

:::demo 点击 TimePicker，然后可以在浮层中选择或者输入某一时间。

time-picker/suffix

:::

## 受控组件

:::demo value 和 onChange 需要配合使用。也可以直接使用v-model。

time-picker/value

:::

## 范围选择器

:::demo 通过 `TimeRangePicker` 使用时间范围选择器。

time-picker/range-picker

:::

## 无边框

:::demo 无边框样式。

time-picker/bordered

:::

## 自定义状态

:::demo 使用 `status` 为 DatePicker 添加状态，可选 `error` 或者 `warning`。

time-picker/status

:::

## 弹出位置

:::demo 可以通过 `placement` 手动指定弹出的位置。

time-picker/placement

:::

## API

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  allowClear  |  是否展示清除按钮  |  boolean  |  true  |    |
|  autofocus  |  自动获取焦点  |  boolean  |  false  |    |
|  bordered  |  是否有边框  |  boolean  |  true  |    |
|  clearIcon  |  自定义的清除图标  |  v-slot:clearIcon  |  -  |    |
|  clearText  |  清除按钮的提示文案  |  string  |  clear  |    |
|  disabled  |  禁用全部操作  |  boolean  |  false  |    |
|  disabledTime  |  不可选择的时间  |  [DisabledTime](#disabledtime)  |  -  |  3.3.0  |
|  format  |  展示的时间格式  |  string  |  `HH:mm:ss`  |    |
|  getPopupContainer  |  定义浮层的容器，默认为 body 上新建 div  |  function(trigger)  |  -  |    |
|  hideDisabledOptions  |  隐藏禁止选择的选项  |  boolean  |  false  |    |
|  hourStep  |  小时选项间隔  |  number  |  1  |    |
|  inputReadOnly  |  设置输入框为只读（避免在移动设备上打开虚拟键盘）  |  boolean  |  false  |    |
|  minuteStep  |  分钟选项间隔  |  number  |  1  |    |
|  open(v-model)  |  面板是否打开  |  boolean  |  false  |    |
|  placeholder  |  没有值的时候显示的内容  |  string \ |  \[string, string]  |  `请选择时间`  |    |
|  placement  |  选择框弹出的位置  |  `bottomLeft` `bottomRight` `topLeft` `topRight`  |  bottomLeft  |    |
|  popupClassName  |  弹出层类名  |  string  |  -  |    |
|  popupStyle  |  弹出层样式对象  |  object  |  -  |    |
|  renderExtraFooter  |  选择框底部显示自定义的内容  |  v-slot:renderExtraFooter  |  -  |    |
|  secondStep  |  秒选项间隔  |  number  |  1  |    |
|  showNow  |  面板是否显示“此刻”按钮  |  boolean  |  -  |    |
|  status  |  设置校验状态  |  'error' \ |  'warning'  |  -  |  3.3.0  |
|  suffixIcon  |  自定义的选择框后缀图标  |  v-slot:suffixIcon  |  -  |    |
|  use12Hours  |  使用 12 小时制，为 true 时 `format` 默认为 `h:mm:ss a`  |  boolean  |  false  |    |
|  value(v-model)  |  当前时间  |  [dayjs](https://day.js.org/)  |  -  |    |
|  valueFormat  |  可选，绑定值的格式，对 value、defaultValue 起作用。不指定则绑定值为 dayjs 对象  |  string，[具体格式](https://day.js.org/docs/zh-CN/display/format)  |  -  |    |

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

### 事件

|  事件名称    |  说明                   |  回调参数                                                   |
| ---------- | --------------------- | --------------------------------------------------------- |
|  change      |  时间发生变化的回调     |  function(time: dayjs \ |  string, timeString: string): void  |
|  openChange  |  面板打开/关闭时的回调  |  (open: boolean): void                                      |

## 方法

|  名称     |  描述      |
| ------- | -------- |
|  blur()   |  移除焦点  |
|  focus()  |  获取焦点  |

### TimeRangePicker

属性与 DatePicker 的 [RangePicker](/components/date-picker/#rangepicker) 相同。还包含以下属性：

|  参数          |  说明                  |  类型                                     |  默认值  |  版本   |
| ------------ | -------------------- | --------------------------------------- | ------ | ----- |
|  order         |  始末时间是否自动排序  |  boolean                                  |  true    |         |
|  disabledTime  |  不可选择的时间        |  [RangeDisabledTime](#pangedisabledtime)  |  -       |  3.3.0  |

#### RangeDisabledTime

```typescript
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

## FAQ

| ### 如何在 DatePicker 中使用自定义日期库（如 moment.js \ |  dayjs \ |  date-fns）？ |

请参考[《自定义日期库》](/docs/vue/replace-date-cn)
