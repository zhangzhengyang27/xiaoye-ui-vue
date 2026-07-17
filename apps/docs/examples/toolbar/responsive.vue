<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-radio-group v-model:value="screen" button-style="solid">
      <xy-radio-button value="wide">宽屏</xy-radio-button>
      <xy-radio-button value="medium">中屏</xy-radio-button>
      <xy-radio-button value="narrow">窄屏</xy-radio-button>
    </xy-radio-group>

    <div class="screen-frame" :style="{ width: frameWidth }">
      <xy-toolbar>
        <template #start>
          <xy-button type="primary" :icon="h(EditOutlined)">编辑</xy-button>
          <template v-if="screen !== 'narrow'">
            <xy-button :icon="h(CopyOutlined)">复制</xy-button>
            <xy-button :icon="h(ShareAltOutlined)">分享</xy-button>
          </template>
        </template>
        <template #center>
          <template v-if="screen === 'wide'">
            <xy-input-search v-model:value="keyword" placeholder="搜索" style="width: 200px" />
          </template>
        </template>
        <template #end>
          <xy-tooltip title="更多">
            <xy-button :icon="h(EllipsisOutlined)" />
          </xy-tooltip>
        </template>
      </xy-toolbar>
      <div class="screen-placeholder">
        当前模拟宽度：{{ frameWidth }}（通过 v-if 控制工具栏内容随屏幕宽度变化）
      </div>
    </div>
  </xy-space>
</template>
<script lang="ts" setup>
import { h, ref, computed } from 'vue';
import { EditOutlined, CopyOutlined, ShareAltOutlined, EllipsisOutlined } from '@xiaoye-ui/icons';

const screen = ref<'wide' | 'medium' | 'narrow'>('wide');
const keyword = ref('');

const frameWidth = computed(() => {
  if (screen.value === 'wide') return '100%';
  if (screen.value === 'medium') return '560px';
  return '320px';
});
</script>
<style scoped>
.screen-frame {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  transition: width 0.3s;
}
.screen-placeholder {
  padding: 24px;
  color: #999;
  background: #fafafa;
  text-align: center;
}
</style>
