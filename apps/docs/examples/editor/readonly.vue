<template>
  <div class="demo-editor-wrap">
    <div class="demo-toolbar">
      <xy-switch v-model:checked="readonly" />
      <span class="demo-toolbar-text">readonly = {{ readonly }}</span>
    </div>
    <xy-editor v-model="content" :readonly="readonly" :editor-style="{ height: '220px' }" />
    <p class="demo-tip">
      切换开关后，编辑器会在「可编辑」与「只读」之间切换；只读模式下工具栏仍可见但内容不可修改。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const readonly = ref(true);
const content = ref(
  '<h3>只读模式示例</h3><p>当前内容为只读，无法编辑。关闭开关即可恢复编辑能力。</p><ul><li>列表项一</li><li>列表项二</li></ul>',
);
</script>

<style scoped>
.demo-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-toolbar-text {
  font-size: 13px;
  color: #555;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
