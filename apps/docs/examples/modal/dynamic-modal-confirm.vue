<template>
  <xy-space wrap>
    <xy-button @click="openInfo">Info</xy-button>
    <xy-button type="primary" @click="openSuccess">Success</xy-button>
    <xy-button danger @click="openError">Error</xy-button>
    <xy-button type="dashed" @click="openWarning">Warning</xy-button>
    <xy-button type="primary" @click="openConfirm">Confirm</xy-button>
  </xy-space>
  <holder />
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { useDynamicModal } from 'xiaoye-ui';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@xiaoye-ui/icons';

type ConfirmType = 'info' | 'success' | 'error' | 'warning' | 'confirm';

const [modal, holder] = useDynamicModal();

const typeIconMap: Record<ConfirmType, any> = {
  info: InfoCircleOutlined,
  success: CheckCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
  confirm: ExclamationCircleOutlined,
};

const typeColorMap: Record<ConfirmType, string> = {
  info: '#1677ff',
  success: '#52c41a',
  error: '#ff4d4f',
  warning: '#faad14',
  confirm: '#faad14',
};

const ConfirmContent = defineComponent({
  name: 'ConfirmContent',
  props: ['type', 'title', 'content'],
  render() {
    const Icon = typeIconMap[this.type as ConfirmType];
    const color = typeColorMap[this.type as ConfirmType];
    return h('div', { style: 'display: flex; gap: 12px; padding: 8px 0;' }, [
      h(Icon, { style: `color: ${color}; font-size: 22px; margin-top: 1px;` }),
      h('div', null, [
        h('div', { style: 'font-weight: 500; margin-bottom: 8px; color: #333;' }, this.title),
        h('div', { style: 'color: #666; line-height: 1.6;' }, this.content),
      ]),
    ]);
  },
});

const openInfo = () => {
  modal.open(ConfirmContent, {
    componentProps: { type: 'info', title: '提示信息', content: '这是一条普通提示信息。' },
    modalProps: { title: 'Info', width: 416, okText: '知道了', cancelText: '关闭' },
  });
};

const openSuccess = () => {
  modal.open(ConfirmContent, {
    componentProps: { type: 'success', title: '操作成功', content: '你的操作已经成功完成。' },
    modalProps: { title: 'Success', width: 416, okText: '确定', cancelText: '取消' },
  });
};

const openError = () => {
  modal.open(ConfirmContent, {
    componentProps: { type: 'error', title: '操作失败', content: '操作过程中发生错误，请重试。' },
    modalProps: { title: 'Error', width: 416, okText: '确定', cancelText: '取消' },
  });
};

const openWarning = () => {
  modal.open(ConfirmContent, {
    componentProps: {
      type: 'warning',
      title: '警告提示',
      content: '此操作可能存在风险，请谨慎处理。',
    },
    modalProps: { title: 'Warning', width: 416, okText: '确定', cancelText: '取消' },
  });
};

const openConfirm = () => {
  modal.open(ConfirmContent, {
    componentProps: {
      type: 'confirm',
      title: '确认删除？',
      content: '删除后将无法恢复，请确认是否继续。',
    },
    modalProps: {
      title: 'Confirm',
      width: 416,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
    },
  });
};
</script>
