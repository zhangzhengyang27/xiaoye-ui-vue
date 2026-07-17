<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      :message="`未受控模式：点击标题右侧箭头可展开 / 折叠。当前状态：${uncontrolled ? '已折叠' : '已展开'}`"
    />
    <xy-panel title="可折叠面板（未受控）" toggleable style="width: 360px">
      <p>
        设置
        <code>toggleable</code>
        后，标题右侧出现切换按钮，点击即可折叠 / 展开内容。
      </p>
      <p>
        未传入
        <code>collapsed</code>
        时为非受控模式，组件内部维护状态。
      </p>
    </xy-panel>

    <xy-divider />

    <xy-space align="center">
      <xy-button type="primary" @click="controlled = !controlled">
        外部切换状态：{{ controlled ? '已折叠' : '已展开' }}
      </xy-button>
    </xy-space>
    <xy-panel
      v-model:collapsed="controlled"
      title="可折叠面板（受控）"
      toggleable
      style="width: 360px"
      @toggle="onToggle"
    >
      <p>
        通过
        <code>v-model:collapsed</code>
        双向绑定折叠状态，可由外部完全控制。
      </p>
      <p>
        切换时触发
        <code>toggle</code>
        事件，回调参数为 { originalEvent, value }。
      </p>
    </xy-panel>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

const uncontrolled = ref(false);
const controlled = ref(false);

function onToggle(event: any) {
  message.info(`触发了 toggle 事件，当前值：${event.value}`);
}
</script>
<style scoped>
:deep(.xy-panel p) {
  margin: 4px 0;
}
</style>
