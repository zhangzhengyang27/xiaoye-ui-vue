<!-- 底部固定：演示 offsetBottom 属性，元素距离窗口底部 50px 时触发固定，并通过 change 事件显示当前状态 -->
<template>
  <div class="affix-offset-bottom-demo">
    <xy-alert
      :message="`当前状态：${affixed ? '已固定到底部' : '未固定'}（offsetBottom = ${offsetBottom}px）`"
      :type="affixed ? 'success' : 'info'"
      show-icon
      style="margin-bottom: 16px"
    />
    <div class="scroll-area">
      <p class="placeholder">向下滚动页面，按钮距离底部 50px 时触发底部固定。</p>
      <div class="spacer" />
      <p class="placeholder">中间内容区域。</p>
      <div class="spacer large" />
      <xy-affix :offset-bottom="offsetBottom" @change="onAffixChange">
        <xy-button type="primary">距底 50px 时固定</xy-button>
      </xy-affix>
      <div class="spacer large" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const offsetBottom = ref<number>(50);
const affixed = ref<boolean>(false);

const onAffixChange = (value: boolean) => {
  affixed.value = value;
};
</script>

<style scoped>
.affix-offset-bottom-demo .scroll-area {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.affix-offset-bottom-demo .placeholder {
  margin: 0 0 12px;
  color: #595959;
}

.affix-offset-bottom-demo .spacer {
  height: 120px;
}

.affix-offset-bottom-demo .spacer.large {
  height: 200px;
}
</style>
