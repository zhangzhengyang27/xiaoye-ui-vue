<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-fieldset>
      <template #legend>
        <div class="custom-legend">
          <span class="legend-icon">
            <UserOutlined />
          </span>
          <span class="legend-text">用户信息</span>
          <xy-tag color="blue" size="small">主账号</xy-tag>
        </div>
      </template>
      <xy-descriptions :column="2" size="small">
        <xy-descriptions-item label="姓名">张三</xy-descriptions-item>
        <xy-descriptions-item label="角色">管理员</xy-descriptions-item>
      </xy-descriptions>
    </xy-fieldset>

    <xy-fieldset toggleable>
      <template #legend="{ toggleCallback }">
        <div class="custom-legend" @click="toggleCallback">
          <span class="legend-icon warning">
            <WarningFilled />
          </span>
          <span class="legend-text">风险提示</span>
          <xy-tag color="red" size="small">需关注</xy-tag>
        </div>
      </template>
      <xy-alert
        type="warning"
        show-icon
        message="检测到当前账户存在异常登录行为，建议立即修改密码并启用两步验证。"
      />
    </xy-fieldset>

    <xy-fieldset toggleable>
      <template #toggleicon="{ collapsed, class: iconClass }">
        <span :class="iconClass" class="custom-toggle-icon">
          {{ collapsed ? '展开' : '收起' }}
        </span>
      </template>
      <template #legend>自定义切换图标</template>
      <p>
        通过
        <code>toggleicon</code>
        插槽可自定义切换图标，此处用文字「展开 / 收起」替代默认的 + / -。
      </p>
      <p>
        插槽参数包含
        <code>collapsed</code>
        （当前是否折叠）与
        <code>class</code>
        （默认图标类名）。
      </p>
    </xy-fieldset>
  </xy-space>
</template>
<script lang="ts" setup>
import { UserOutlined, WarningFilled } from '@xiaoye-ui/icons';
</script>
<style scoped>
.custom-legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.legend-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e6f4ff;
  color: #1677ff;
  font-size: 14px;
}
.legend-icon.warning {
  background: #fffbe6;
  color: #faad14;
}
.legend-text {
  font-weight: 500;
}
.custom-toggle-icon {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  color: #595959;
}
</style>
