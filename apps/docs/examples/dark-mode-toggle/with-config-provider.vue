<template>
  <!-- 配合 ConfigProvider：根据 isDark 动态切换 theme.algorithm -->
  <xy-config-provider :theme="themeConfig">
    <xy-space direction="vertical" size="middle">
      <xy-dark-mode-toggle v-model:dark="dark" />
      <xy-card title="主题预览">
        <xy-space direction="vertical">
          <xy-typography>
            <xy-paragraph>当前主题：{{ dark ? '暗色 Dark' : '亮色 Light' }}</xy-paragraph>
          </xy-typography>
          <xy-space>
            <xy-button type="primary">主要按钮</xy-button>
            <xy-button>默认按钮</xy-button>
            <xy-button danger>危险按钮</xy-button>
          </xy-space>
        </xy-space>
      </xy-card>
    </xy-space>
  </xy-config-provider>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { theme } from 'xiaoye-ui';

const dark = ref(false);

const themeConfig = computed(() => ({
  algorithm: dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}));
</script>
