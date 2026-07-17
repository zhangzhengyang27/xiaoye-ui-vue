<template>
  <div style="display: flex">
    <xy-watermark v-bind="model">
      <xy-typography>
        <xy-typography-paragraph>
          The light-speed iteration of the digital world makes products more complex. However, human
          consciousness and attention resources are limited. Facing this design contradiction, the
          pursuit of natural interaction will be the consistent direction of Xiaoye UI.
        </xy-typography-paragraph>
        <xy-typography-paragraph>
          Natural user cognition: According to cognitive psychology, about 80% of external
          information is obtained through visual channels. The most important visual elements in the
          interface design, including layout, colors, illustrations, icons, etc., should fully
          absorb the laws of nature, thereby reducing the user&apos;s cognitive cost and bringing
          authentic and smooth feelings. In some scenarios, opportunely adding other sensory
          channels such as hearing, touch can create a richer and more natural product experience.
        </xy-typography-paragraph>
        <xy-typography-paragraph>
          Natural user behavior: In the interaction with the system, the designer should fully
          understand the relationship between users, system roles, and task objectives, and also
          contextually organize system functions and services. At the same time, a series of methods
          such as behavior analysis, artificial intelligence and sensors could be applied to assist
          users to make effective decisions and reduce extra operations of users, to save
          users&apos; mental and physical resources and make human-computer interaction more
          natural.
        </xy-typography-paragraph>
      </xy-typography>
      <img
        style="z-index: 10; width: 100%; max-width: 800px; position: relative"
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
        alt="示例图片"
      />
    </xy-watermark>
    <xy-form
      style="
        width: 280px;
        flex-shrink: 0;
        border-left: 1px solid #eee;
        padding-left: 20px;
        margin-left: 20px;
      "
      layout="vertical"
      :model="model"
    >
      <xy-form-item name="content" label="Content">
        <xy-input v-model:value="model.content" />
      </xy-form-item>
      <xy-form-item name="font.fontSize" label="FontSize">
        <xy-slider v-model:value="model.font.fontSize" :step="1" :min="0" :max="100" />
      </xy-form-item>
      <xy-form-item name="zIndex" label="zIndex">
        <xy-slider v-model:value="model.zIndex" :step="1" :min="0" :max="100" />
      </xy-form-item>
      <xy-form-item name="rotate" label="Rotate">
        <xy-slider v-model:value="model.rotate" :step="1" :min="-180" :max="180" />
      </xy-form-item>
      <xy-form-item label="Gap" style="margin-bottom: 0">
        <xy-space style="display: flex" align="baseline">
          <xy-form-item :name="['gap', 0]">
            <xy-input-number v-model:value="model.gap[0]" placeholder="gapX" />
          </xy-form-item>
          <xy-form-item :name="['gap', 1]">
            <xy-input-number v-model:value="model.gap[1]" placeholder="gapY" />
          </xy-form-item>
        </xy-space>
      </xy-form-item>
      <xy-form-item label="Offset" style="margin-bottom: 0">
        <xy-space style="display: flex" align="baseline">
          <xy-form-item :name="['offset', 0]">
            <xy-input-number v-model:value="model.offset[0]" placeholder="offsetLeft" />
          </xy-form-item>
          <xy-form-item :name="['offset', 1]">
            <xy-input-number v-model:value="model.offset[1]" placeholder="offsetTop" />
          </xy-form-item>
        </xy-space>
      </xy-form-item>
    </xy-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const model = reactive({
  content: 'Xiaoye UI',
  font: {
    fontSize: 16,
  },
  zIndex: 11,
  rotate: -22,
  gap: [100, 100] as [number, number],
  offset: [],
});
</script>
