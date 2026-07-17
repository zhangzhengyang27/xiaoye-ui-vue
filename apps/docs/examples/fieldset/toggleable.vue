<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="设置 toggleable 后，legend 区域变为可点击按钮，点击 + / - 图标可切换内容显隐。"
    />

    <xy-fieldset legend="高级筛选（默认展开）" toggleable>
      <xy-form layout="inline">
        <xy-form-item label="订单号">
          <xy-input placeholder="请输入订单号" />
        </xy-form-item>
        <xy-form-item label="状态">
          <xy-select style="width: 120px" placeholder="全部" />
        </xy-form-item>
        <xy-form-item label="日期">
          <xy-date-picker placeholder="选择日期" />
        </xy-form-item>
        <xy-form-item>
          <xy-button type="primary">查询</xy-button>
        </xy-form-item>
      </xy-form>
    </xy-fieldset>

    <xy-fieldset legend="更多选项（默认折叠）" toggleable :collapsed="true">
      <p>这是默认折叠的内容区域，点击 legend 处的 + 号展开。</p>
      <xy-checkbox-group v-model:value="checked">
        <xy-checkbox value="a">显示已删除</xy-checkbox>
        <xy-checkbox value="b">仅显示异常</xy-checkbox>
        <xy-checkbox value="c">包含子订单</xy-checkbox>
      </xy-checkbox-group>
    </xy-fieldset>

    <xy-divider />

    <xy-space align="center">
      <xy-button type="primary" @click="controlled = !controlled">
        受控切换：{{ controlled ? '已折叠' : '已展开' }}
      </xy-button>
    </xy-space>
    <xy-fieldset v-model:collapsed="controlled" legend="受控字段集" toggleable @toggle="onToggle">
      <p>
        通过
        <code>v-model:collapsed</code>
        双向绑定，可由外部完全控制折叠状态。
      </p>
      <p>
        同时触发
        <code>toggle</code>
        事件，回调参数为 { originalEvent, value }。
      </p>
    </xy-fieldset>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const controlled = ref(false);
const checked = ref<string[]>([]);

function onToggle(event: any) {
  message.info(`toggle 事件触发，当前值：${event.value}`);
}
</script>
