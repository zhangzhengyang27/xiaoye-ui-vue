<template>
  <xy-space direction="vertical">
    <xy-button type="primary" @click="openCreate">新建用户</xy-button>
    <xy-button @click="openEdit">编辑用户（带初始值）</xy-button>
    <p v-if="lastSubmitted" style="margin: 0; color: #52c41a">最近一次提交：{{ lastSubmitted }}</p>
    <holder />
  </xy-space>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { useDynamicModal } from 'xiaoye-ui';
import type { DynamicModalRef } from 'xiaoye-ui';

const [modal, holder] = useDynamicModal();
const modalRef = ref<DynamicModalRef | null>(null);
const lastSubmitted = ref('');

// 表单内容组件：内部管理表单状态，通过 onSubmit 回调向外传递数据
const UserForm = defineComponent({
  name: 'UserForm',
  props: ['initialName', 'initialEmail', 'onSubmit', 'onCancel'],
  setup(props) {
    const name = ref(props.initialName ?? '');
    const email = ref(props.initialEmail ?? '');
    const submitting = ref(false);

    const submit = () => {
      if (!name.value || !email.value) {
        console.warn('请填写完整信息');
        return;
      }
      submitting.value = true;
      // 模拟异步提交
      setTimeout(() => {
        submitting.value = false;
        props.onSubmit?.({ name: name.value, email: email.value });
      }, 500);
    };

    const inputStyle =
      'width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 6px; outline: none; box-sizing: border-box;';
    const labelStyle = 'display: block; margin-bottom: 6px; color: #333; font-size: 14px;';

    return () =>
      h('div', { style: 'padding: 8px 0;' }, [
        h('div', { style: 'margin-bottom: 16px;' }, [
          h('label', { style: labelStyle }, '姓名'),
          h('input', {
            value: name.value,
            onInput: (e: any) => (name.value = e.target.value),
            style: inputStyle,
            placeholder: '请输入姓名',
          }),
        ]),
        h('div', { style: 'margin-bottom: 16px;' }, [
          h('label', { style: labelStyle }, '邮箱'),
          h('input', {
            value: email.value,
            onInput: (e: any) => (email.value = e.target.value),
            style: inputStyle,
            placeholder: '请输入邮箱',
          }),
        ]),
        h('div', { style: 'text-align: right;' }, [
          h(
            'button',
            {
              onClick: () => props.onCancel?.(),
              style:
                'margin-right: 8px; padding: 6px 16px; background: #fff; color: #333; border: 1px solid #d9d9d9; border-radius: 6px; cursor: pointer;',
            },
            '取消',
          ),
          h(
            'button',
            {
              onClick: submit,
              disabled: submitting.value,
              style:
                'padding: 6px 16px; background: #1677ff; color: #fff; border: 1px solid #1677ff; border-radius: 6px; cursor: pointer;',
            },
            submitting.value ? '提交中...' : '提交',
          ),
        ]),
      ]);
  },
});

const openCreate = () => {
  modalRef.value = modal.open(UserForm, {
    componentProps: {
      onSubmit: (data: { name: string; email: string }) => {
        lastSubmitted.value = `新建用户 ${data.name} <${data.email}>`;
        modalRef.value?.destroy();
      },
      onCancel: () => modalRef.value?.destroy(),
    },
    modalProps: {
      title: '新建用户',
      width: 480,
      footer: null,
    },
  });
};

const openEdit = () => {
  modalRef.value = modal.open(UserForm, {
    componentProps: {
      initialName: '张三',
      initialEmail: 'zhangsan@example.com',
      onSubmit: (data: { name: string; email: string }) => {
        lastSubmitted.value = `编辑用户 ${data.name} <${data.email}>`;
        modalRef.value?.destroy();
      },
      onCancel: () => modalRef.value?.destroy(),
    },
    modalProps: {
      title: '编辑用户',
      width: 480,
      footer: null,
    },
  });
};
</script>
