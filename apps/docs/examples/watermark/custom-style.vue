<template>
  <div class="custom-style-wrapper">
    <!-- 实时预览：根据 xy-slider 实时调整水印样式 -->
    <xy-watermark
      :content="form.content"
      :rotate="form.rotate"
      :gap="form.gap"
      :font="{
        color: form.fontColor,
        fontSize: form.fontSize,
        fontWeight: form.fontWeight,
      }"
      :z-index="form.zIndex"
    >
      <div class="preview-area">
        <xy-typography>
          <xy-typography-title :level="4">自定义水印样式预览</xy-typography-title>
          <xy-typography-paragraph>
            通过左侧 xy-slider 实时调整水印的字体颜色、字号、旋转角度、间距等参数，
            可以快速预览不同样式组合下的视觉效果。
          </xy-typography-paragraph>
          <xy-typography-paragraph type="secondary">
            建议水印颜色保持低饱和度与低透明度，避免遮挡主要内容。
          </xy-typography-paragraph>
        </xy-typography>
      </div>
    </xy-watermark>

    <!-- 控制面板 -->
    <xy-card class="control-panel" size="small" title="样式参数">
      <xy-form layout="vertical" :model="form">
        <xy-form-item label="水印内容">
          <xy-input v-model:value="form.content" placeholder="水印文字" />
        </xy-form-item>
        <xy-form-item label="字体颜色">
          <xy-space align="center">
            <input v-model="form.fontColor" type="color" class="color-picker" />
            <xy-typography-text type="secondary">{{ form.fontColor }}</xy-typography-text>
          </xy-space>
        </xy-form-item>
        <xy-form-item label="字号 fontSize">
          <xy-slider v-model:value="form.fontSize" :min="8" :max="48" :step="1" />
        </xy-form-item>
        <xy-form-item label="字重 fontWeight">
          <xy-segmented v-model:value="form.fontWeight" :options="fontWeightOptions" block />
        </xy-form-item>
        <xy-form-item label="旋转角度">
          <xy-slider v-model:value="form.rotate" :min="-90" :max="90" :step="1" />
        </xy-form-item>
        <xy-form-item label="横向间距 gap X">
          <xy-slider v-model:value="form.gap[0]" :min="40" :max="240" :step="4" />
        </xy-form-item>
        <xy-form-item label="纵向间距 gap Y">
          <xy-slider v-model:value="form.gap[1]" :min="40" :max="240" :step="4" />
        </xy-form-item>
        <xy-form-item label="层级 zIndex">
          <xy-slider v-model:value="form.zIndex" :min="1" :max="20" :step="1" />
        </xy-form-item>
      </xy-form>
    </xy-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const fontWeightOptions = [
  { label: 'normal', value: 'normal' },
  { label: 'light', value: 'light' },
  { label: 'bold', value: 'weight' },
];

const form = reactive({
  content: 'XiaoyeUI 水印示例',
  fontColor: 'rgba(22, 119, 255, 0.15)',
  fontSize: 16,
  fontWeight: 'normal' as 'normal' | 'light' | 'weight',
  rotate: -22,
  gap: [100, 100] as [number, number],
  zIndex: 9,
});
</script>

<style scoped>
.custom-style-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.preview-area {
  flex: 1;
  min-height: 480px;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
}
.control-panel {
  width: 320px;
  flex-shrink: 0;
}
.color-picker {
  width: 40px;
  height: 28px;
  padding: 0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}
@media (max-width: 768px) {
  .custom-style-wrapper {
    flex-direction: column;
  }
  .control-panel {
    width: 100%;
  }
}
</style>
