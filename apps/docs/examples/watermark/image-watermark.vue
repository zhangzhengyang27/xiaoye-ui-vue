<template>
  <div class="image-watermark-wrapper">
    <!-- 预览区：根据 xy-slider 实时调整图片水印参数 -->
    <xy-watermark
      :image="imageUrl"
      :width="form.width"
      :height="form.height"
      :rotate="form.rotate"
      :gap="form.gap"
      :z-index="form.zIndex"
    >
      <div class="preview-area">
        <xy-empty description="图片水印预览区" />
      </div>
    </xy-watermark>

    <!-- 控制面板 -->
    <xy-card class="control-panel" size="small" title="图片水印参数">
      <xy-space direction="vertical" :size="12" style="width: 100%">
        <div class="control-row">
          <span class="control-label">宽度 width</span>
          <xy-slider v-model:value="form.width" :min="40" :max="240" :step="4" style="flex: 1" />
          <span class="control-value">{{ form.width }}px</span>
        </div>
        <div class="control-row">
          <span class="control-label">高度 height</span>
          <xy-slider v-model:value="form.height" :min="20" :max="160" :step="4" style="flex: 1" />
          <span class="control-value">{{ form.height }}px</span>
        </div>
        <div class="control-row">
          <span class="control-label">旋转 rotate</span>
          <xy-slider v-model:value="form.rotate" :min="-90" :max="90" :step="1" style="flex: 1" />
          <span class="control-value">{{ form.rotate }}°</span>
        </div>
        <div class="control-row">
          <span class="control-label">间距 gap X</span>
          <xy-slider v-model:value="form.gap[0]" :min="20" :max="240" :step="4" style="flex: 1" />
          <span class="control-value">{{ form.gap[0] }}px</span>
        </div>
        <div class="control-row">
          <span class="control-label">间距 gap Y</span>
          <xy-slider v-model:value="form.gap[1]" :min="20" :max="240" :step="4" style="flex: 1" />
          <span class="control-value">{{ form.gap[1] }}px</span>
        </div>
        <xy-alert type="info" show-icon banner>
          <template #message>
            如需调整图片水印的不透明度（opacity），建议对源图进行预处理， 或在
            <code>image-watermark-wrapper</code>
            上叠加半透明蒙版实现视觉效果。
          </template>
        </xy-alert>
      </xy-space>
    </xy-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

// 图片地址建议使用 2 倍或 3 倍图，避免高清下被拉伸
const imageUrl =
  'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original';

const form = reactive({
  width: 120,
  height: 64,
  rotate: -22,
  gap: [100, 100] as [number, number],
  zIndex: 9,
});
</script>

<style scoped>
.image-watermark-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.preview-area {
  height: 360px;
  background: #fafafa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.control-panel {
  width: 320px;
  flex-shrink: 0;
}
.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.control-label {
  width: 80px;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}
.control-value {
  width: 56px;
  text-align: right;
  color: #1677ff;
  font-size: 13px;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .image-watermark-wrapper {
    flex-direction: column;
  }
  .control-panel {
    width: 100%;
  }
}
</style>
