<!-- 在 Drawer 中使用 FocusTrap：将 xy-focus-trap 包裹在 Drawer 内容区，打开后焦点不会跳出 Drawer -->
<template>
  <div>
    <xy-space direction="vertical" :size="8">
      <xy-button type="primary" @click="open = true">打开 Drawer</xy-button>
      <span class="demo-tip">
        打开 Drawer 后，Tab 键只在 Drawer 内的输入框与按钮之间循环，不会跳到页面其它元素。
      </span>
      <xy-button class="demo-outside">外部按钮（不会被聚焦）</xy-button>
    </xy-space>

    <xy-drawer
      v-model:open="open"
      title="筛选条件（焦点陷阱已启用）"
      width="380"
      placement="right"
      :mask-closable="false"
      :destroy-on-close="true"
    >
      <xy-focus-trap>
        <xy-form :model="form" layout="vertical">
          <xy-form-item label="名称">
            <xy-input v-model:value="form.name" placeholder="请输入名称" />
          </xy-form-item>
          <xy-form-item label="状态">
            <xy-select v-model:value="form.status" placeholder="请选择状态" style="width: 100%">
              <xy-select-option value="active">启用</xy-select-option>
              <xy-select-option value="inactive">停用</xy-select-option>
            </xy-select>
          </xy-form-item>
          <xy-form-item label="日期">
            <xy-date-picker v-model:value="form.date" style="width: 100%" />
          </xy-form-item>
          <xy-form-item>
            <xy-space style="width: 100%; justify-content: flex-end">
              <xy-button @click="open = false">取消</xy-button>
              <xy-button type="primary" @click="onApply">应用</xy-button>
            </xy-space>
          </xy-form-item>
        </xy-form>
      </xy-focus-trap>
    </xy-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const open = ref(false);
const form = reactive({
  name: '',
  status: '' as string,
  date: undefined as any,
});

const onApply = () => {
  open.value = false;
};
</script>

<style scoped>
.demo-tip {
  font-size: 12px;
  color: #999;
}
.demo-outside {
  margin-top: 8px;
}
</style>
