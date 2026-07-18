<template>
  <div class="demo-markdown-editor-wrap">
    <xy-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <xy-form-item label="标题" name="title">
        <xy-input v-model:value="formState.title" placeholder="请输入文章标题" />
      </xy-form-item>

      <xy-form-item label="内容" name="content" required>
        <xy-markdown-editor
          v-model="formState.content"
          :height="300"
          placeholder="请输入正文内容（支持 Markdown 语法）"
        />
      </xy-form-item>

      <xy-form-item label="分类" name="category">
        <xy-select v-model:value="formState.category" placeholder="请选择分类" allow-clear>
          <xy-select-option value="frontend">前端</xy-select-option>
          <xy-select-option value="backend">后端</xy-select-option>
          <xy-select-option value="design">设计</xy-select-option>
          <xy-select-option value="devops">运维</xy-select-option>
        </xy-select>
      </xy-form-item>

      <xy-form-item :wrapper-col="{ offset: 4, span: 18 }">
        <xy-space>
          <xy-button type="primary" @click="onSubmit">提交</xy-button>
          <xy-button @click="onReset">重置</xy-button>
        </xy-space>
      </xy-form-item>
    </xy-form>

    <div class="demo-tip">
      编辑器内容通过
      <code>v-model</code>
      绑定到 form model 的
      <code>content</code>
      字段，与普通表单控件用法一致； 提交时触发表单校验，内容为空会显示错误信息。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { message } from 'xiaoye-ui';
import type { Rule } from 'xiaoye-ui/form';

interface FormState {
  title: string;
  content: string;
  category: string | undefined;
}

const formRef = ref();

const formState = reactive<FormState>({
  title: '',
  content: '',
  category: undefined,
});

const rules: Record<string, Rule[]> = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入正文内容', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      message.success('提交成功');
      console.warn('表单数据：', {
        title: formState.title,
        content: formState.content,
        category: formState.category,
      });
    })
    .catch((error: unknown) => {
      console.warn('校验失败：', error);
    });
};

const onReset = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
