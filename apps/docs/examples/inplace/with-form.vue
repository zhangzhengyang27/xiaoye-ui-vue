<template>
  <div class="inplace-with-form">
    <xy-inplace v-model:active="active">
      <template #display>
        <span class="display-text">{{ form.name }} · {{ form.email }}</span>
      </template>
      <template #content="{ closeCallback }">
        <xy-form layout="inline" :model="form">
          <xy-form-item>
            <xy-input v-model:value="form.name" placeholder="姓名" />
          </xy-form-item>
          <xy-form-item>
            <xy-input v-model:value="form.email" placeholder="邮箱" />
          </xy-form-item>
          <xy-form-item>
            <xy-button type="primary" size="small" @click="handleSubmit(closeCallback)">
              保存
            </xy-button>
          </xy-form-item>
        </xy-form>
      </template>
    </xy-inplace>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { message } from 'xiaoye-ui';

const active = ref(false);
const form = reactive({
  name: '张三',
  email: 'zhangsan@example.com',
});

// 保存后退出编辑模式
function handleSubmit(closeCallback: (event?: Event) => void) {
  message.success('保存成功');
  closeCallback();
}
</script>

<style scoped>
.inplace-with-form .display-text {
  cursor: pointer;
  color: #1677ff;
}
</style>
