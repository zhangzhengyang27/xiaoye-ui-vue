<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="通过 legend 插槽可完全自定义 legend 区域，在标题旁放置操作按钮。插槽提供 toggleCallback 用于切换折叠。"
    />

    <xy-fieldset toggleable>
      <template #legend="{ toggleCallback }">
        <div class="legend-with-actions">
          <button type="button" class="legend-toggle" aria-label="切换收起" @click="toggleCallback">
            <span class="legend-title">
              <SettingOutlined />
              用户配置
            </span>
          </button>
          <xy-space :size="4">
            <xy-tooltip title="重置">
              <xy-button type="text" size="small" :icon="h(ReloadOutlined)" @click.stop="onReset" />
            </xy-tooltip>
            <xy-tooltip title="复制配置">
              <xy-button type="text" size="small" :icon="h(CopyOutlined)" @click.stop="onCopy" />
            </xy-tooltip>
          </xy-space>
        </div>
      </template>

      <xy-form layout="vertical">
        <xy-form-item label="用户名">
          <xy-input v-model:value="form.username" placeholder="请输入用户名" />
        </xy-form-item>
        <xy-form-item label="角色">
          <xy-select v-model:value="form.role" :options="roleOptions" />
        </xy-form-item>
        <xy-form-item label="备注">
          <xy-textarea v-model:value="form.remark" :rows="2" />
        </xy-form-item>
      </xy-form>
    </xy-fieldset>
  </xy-space>
</template>
<script lang="ts" setup>
import { h, reactive } from 'vue';
import { SettingOutlined, ReloadOutlined, CopyOutlined } from '@xiaoye-ui/icons';
import { message } from 'xiaoye-ui';

const form = reactive({
  username: 'admin',
  role: 'editor',
  remark: '',
});

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑' },
  { value: 'viewer', label: '访客' },
];

function onReset() {
  form.username = '';
  form.role = 'viewer';
  form.remark = '';
  message.success('已重置');
}

function onCopy() {
  message.success('配置已复制到剪贴板');
}
</script>
<style scoped>
.legend-with-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.legend-toggle {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font-size: 14px;
}
.legend-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
</style>
