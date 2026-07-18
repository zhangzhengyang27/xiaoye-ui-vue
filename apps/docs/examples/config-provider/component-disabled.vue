<!-- 全局禁用组件：通过 componentDisabled 属性一次性禁用所有支持的表单组件 -->
<template>
  <div>
    <xy-space align="center" class="toolbar">
      <span class="toolbar-label">componentDisabled</span>
      <xy-switch v-model:checked="disabled" />
      <span class="toolbar-state">{{ disabled ? '已禁用全部组件' : '组件可用' }}</span>
    </xy-space>

    <xy-config-provider :component-disabled="disabled">
      <xy-space direction="vertical" style="width: 100%" :size="16">
        <xy-row :gutter="16">
          <xy-col :span="6">
            <div class="field-label">Button</div>
            <xy-space>
              <xy-button type="primary">主按钮</xy-button>
              <xy-button>次按钮</xy-button>
            </xy-space>
          </xy-col>
          <xy-col :span="6">
            <div class="field-label">Input</div>
            <xy-input placeholder="文本输入" />
          </xy-col>
          <xy-col :span="6">
            <div class="field-label">Select</div>
            <xy-select placeholder="请选择" style="width: 100%">
              <xy-select-option value="a">选项 A</xy-select-option>
              <xy-select-option value="b">选项 B</xy-select-option>
            </xy-select>
          </xy-col>
          <xy-col :span="6">
            <div class="field-label">Switch</div>
            <xy-switch default-checked />
          </xy-col>
        </xy-row>

        <xy-row :gutter="16">
          <xy-col :span="6">
            <div class="field-label">Radio</div>
            <xy-radio-group default-value="a">
              <xy-radio value="a">A</xy-radio>
              <xy-radio value="b">B</xy-radio>
            </xy-radio-group>
          </xy-col>
          <xy-col :span="6">
            <div class="field-label">Checkbox</div>
            <xy-checkbox default-checked>同意条款</xy-checkbox>
          </xy-col>
          <xy-col :span="6">
            <div class="field-label">DatePicker</div>
            <xy-date-picker style="width: 100%" />
          </xy-col>
          <xy-col :span="6">
            <div class="field-label">InputNumber</div>
            <xy-input-number style="width: 100%" />
          </xy-col>
        </xy-row>
      </xy-space>
    </xy-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const disabled = ref(true);
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
.toolbar-label {
  font-size: 13px;
  color: #555;
}
.toolbar-state {
  font-size: 12px;
  color: #999;
}
.field-label {
  margin-bottom: 6px;
  font-size: 12px;
  color: #888;
}
</style>
