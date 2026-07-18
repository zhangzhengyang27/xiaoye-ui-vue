<!-- 动态主题切换：通过 xy-config-provider 的 :theme 属性动态切换亮色 / 暗色主题 -->
<template>
  <div class="dynamic-theme-wrapper">
    <xy-space align="center" class="toolbar">
      <span class="toolbar-label">主题模式</span>
      <xy-switch v-model:checked="isDark" checked-children="暗色" un-checked-children="亮色" />
      <xy-button type="primary" @click="randomColor">随机主色</xy-button>
    </xy-space>

    <xy-config-provider :theme="themeConfig">
      <div class="preview-panel">
        <xy-row :gutter="16">
          <xy-col :span="12">
            <xy-card title="组件预览">
              <xy-space direction="vertical" style="width: 100%">
                <xy-input placeholder="请输入内容" />
                <xy-select style="width: 100%" placeholder="请选择">
                  <xy-select-option value="a">选项 A</xy-select-option>
                  <xy-select-option value="b">选项 B</xy-select-option>
                </xy-select>
                <xy-space>
                  <xy-button type="primary">主操作</xy-button>
                  <xy-button>次操作</xy-button>
                  <xy-switch default-checked />
                </xy-space>
              </xy-space>
            </xy-card>
          </xy-col>
          <xy-col :span="12">
            <xy-card title="主题 Token">
              <div class="token-list">
                <div class="token-item">
                  <span class="token-name">colorPrimary</span>
                  <span class="token-value" :style="{ background: token.colorPrimary }">
                    {{ token.colorPrimary }}
                  </span>
                </div>
                <div class="token-item">
                  <span class="token-name">colorBgContainer</span>
                  <span class="token-value" :style="{ background: token.colorBgContainer }">
                    {{ token.colorBgContainer }}
                  </span>
                </div>
                <div class="token-item">
                  <span class="token-name">colorText</span>
                  <span
                    class="token-value"
                    :style="{ background: token.colorText, color: token.colorBgContainer }"
                  >
                    {{ token.colorText }}
                  </span>
                </div>
              </div>
            </xy-card>
          </xy-col>
        </xy-row>
      </div>
    </xy-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { theme } from 'xiaoye-ui';

const isDark = ref(false);
const colorPrimary = ref('#1677ff');
const { token } = theme.useToken();

const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: colorPrimary.value,
  },
}));

const randomColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  colorPrimary.value = `#${hex}`;
};
</script>

<style scoped>
.dynamic-theme-wrapper {
  padding: 8px;
}
.toolbar {
  margin-bottom: 16px;
}
.toolbar-label {
  font-size: 13px;
  color: #555;
}
.preview-panel {
  padding: 16px;
  border-radius: 8px;
  background: #f5f5f5;
}
.token-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.token-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}
.token-name {
  color: #888;
}
.token-value {
  display: inline-block;
  min-width: 100px;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: #fff;
  text-align: center;
}
</style>
