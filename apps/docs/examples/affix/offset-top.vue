<!-- 顶部偏移：演示 offsetTop 属性，滚动到指定位置（80px）才触发固定，并通过 change 事件显示当前状态 -->
<template>
  <div class="affix-offset-top-demo">
    <xy-alert
      :message="`当前状态：${affixed ? '已固定' : '未固定'}（offsetTop = ${offsetTop}px）`"
      :type="affixed ? 'success' : 'info'"
      show-icon
      style="margin-bottom: 16px"
    />
    <div class="scroll-area">
      <p class="placeholder">向下滚动页面，按钮距离顶部 80px 时触发固定。</p>
      <div class="spacer" />
      <xy-affix :offset-top="offsetTop" @change="onAffixChange">
        <xy-button type="primary">距顶 80px 时固定</xy-button>
      </xy-affix>
      <div class="spacer large" />
      <p class="placeholder">继续向下滚动可观察到固定效果。</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const offsetTop = ref<number>(80);
const affixed = ref<boolean>(false);

const onAffixChange = (value: boolean) => {
  affixed.value = value;
};
</script>

<style scoped>
.affix-offset-top-demo .scroll-area {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.affix-offset-top-demo .placeholder {
  margin: 0 0 12px;
  color: #595959;
}

.affix-offset-top-demo .spacer {
  height: 120px;
}

.affix-offset-top-demo .spacer.large {
  height: 200px;
}
</style>
