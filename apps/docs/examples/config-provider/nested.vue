<!-- 嵌套 ConfigProvider：外层配置一个主题，内层嵌套另一个 ConfigProvider 配置不同主题，展示局部覆盖 -->
<template>
  <div>
    <p class="demo-tip">
      外层采用绿色主色，内层
      <code>xy-config-provider</code>
      覆盖为紫红色，仅影响内层组件。
    </p>

    <!-- 外层：绿色主色 -->
    <xy-config-provider
      :theme="{
        token: { colorPrimary: '#52c41a', borderRadius: 8 },
      }"
    >
      <div class="outer-panel">
        <div class="panel-title">外层（绿色主题）</div>
        <xy-space wrap>
          <xy-button type="primary">外层按钮</xy-button>
          <xy-input placeholder="外层输入框" style="width: 160px" />
          <xy-switch default-checked />
        </xy-space>

        <!-- 内层：紫红色主色 + 圆角更大 -->
        <xy-config-provider
          :theme="{
            token: { colorPrimary: '#722ed1', borderRadius: 16 },
          }"
        >
          <div class="inner-panel">
            <div class="panel-title">内层（紫红色主题，圆角 16）</div>
            <xy-space wrap>
              <xy-button type="primary">内层按钮</xy-button>
              <xy-input placeholder="内层输入框" style="width: 160px" />
              <xy-switch default-checked />
            </xy-space>
          </div>
        </xy-config-provider>
      </div>
    </xy-config-provider>
  </div>
</template>

<script lang="ts" setup>
// 仅展示嵌套覆盖，无需额外逻辑
</script>

<style scoped>
.demo-tip {
  margin: 0 0 16px;
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: #333;
}
.outer-panel {
  padding: 16px;
  border: 1px dashed #52c41a;
  border-radius: 8px;
}
.inner-panel {
  margin-top: 16px;
  padding: 16px;
  border: 1px dashed #722ed1;
  border-radius: 16px;
}
.panel-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}
</style>
