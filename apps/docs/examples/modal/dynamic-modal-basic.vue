<template>
  <xy-button @click="openModal">打开动态弹窗</xy-button>
  <holder />
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { useDynamicModal } from 'xiaoye-ui';

const [modal, holder] = useDynamicModal();

const ContentComponent = defineComponent({
  name: 'BasicContent',
  props: ['message'],
  render() {
    return h('div', { style: 'padding: 16px 0; color: #333;' }, this.message);
  },
});

const openModal = () => {
  modal.open(ContentComponent, {
    componentProps: {
      message: '这是通过 useDynamicModal 创建的动态弹窗内容。',
    },
    modalProps: {
      title: '基础用法',
      okText: '知道了',
      cancelText: '关闭',
    },
  });
};
</script>
