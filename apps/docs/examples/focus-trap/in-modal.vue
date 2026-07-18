<!-- 在 Modal 中使用 FocusTrap：将 xy-focus-trap 包裹在 Modal 内容区，打开后焦点不会跳出 Modal -->
<template>
  <div>
    <xy-space direction="vertical" :size="8">
      <xy-button type="primary" @click="open = true">打开 Modal</xy-button>
      <span class="demo-tip">
        打开 Modal 后，Tab 键只在「用户名」「密码」「取消」「确定」之间循环，不会跳到页面其它元素。
      </span>
      <xy-button class="demo-outside">外部按钮（不会被聚焦）</xy-button>
    </xy-space>

    <xy-modal
      v-model:open="open"
      title="登录（焦点陷阱已启用）"
      :width="420"
      :destroy-on-close="true"
      :mask-closable="false"
      :footer="null"
    >
      <xy-focus-trap>
        <xy-form :model="form" layout="vertical">
          <xy-form-item label="用户名">
            <xy-input v-model:value="form.username" placeholder="请输入用户名" />
          </xy-form-item>
          <xy-form-item label="密码">
            <xy-input-password v-model:value="form.password" placeholder="请输入密码" />
          </xy-form-item>
          <xy-form-item>
            <xy-space style="width: 100%; justify-content: flex-end">
              <xy-button @click="open = false">取消</xy-button>
              <xy-button type="primary" @click="onSubmit">确定</xy-button>
            </xy-space>
          </xy-form-item>
        </xy-form>
      </xy-focus-trap>
    </xy-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const open = ref(false);
const form = reactive({
  username: '',
  password: '',
});

const onSubmit = () => {
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
