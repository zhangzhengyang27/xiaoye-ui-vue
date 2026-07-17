<template>
  <xy-space wrap>
    <xy-button @click="openWide">宽弹窗</xy-button>
    <xy-button @click="openCustomFooter">自定义页脚</xy-button>
    <xy-button @click="openNoMask">无遮罩</xy-button>
    <xy-button @click="openCentered">垂直居中</xy-button>
  </xy-space>
  <holder />
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { useDynamicModal } from 'xiaoye-ui';

const [modal, holder] = useDynamicModal();

const SimpleContent = defineComponent({
  name: 'SimpleContent',
  props: ['text'],
  render() {
    return h('div', { style: 'padding: 24px 0; color: #333; text-align: center;' }, this.text);
  },
});

const openWide = () => {
  modal.open(SimpleContent, {
    componentProps: { text: '这是一个宽度为 800px 的弹窗。' },
    modalProps: {
      title: '宽弹窗',
      width: 800,
      okText: '确定',
      cancelText: '取消',
    },
  });
};

const openCustomFooter = () => {
  modal.open(SimpleContent, {
    componentProps: { text: '这个弹窗隐藏了默认页脚。' },
    modalProps: {
      title: '自定义页脚',
      footer: null,
      width: 480,
    },
  });
};

const openNoMask = () => {
  modal.open(SimpleContent, {
    componentProps: { text: '这个弹窗没有遮罩层，可以与背景交互。' },
    modalProps: {
      title: '无遮罩',
      mask: false,
      maskClosable: false,
      width: 480,
      okText: '确定',
      cancelText: '取消',
    },
  });
};

const openCentered = () => {
  modal.open(SimpleContent, {
    componentProps: { text: '这个弹窗垂直居中显示。' },
    modalProps: {
      title: '垂直居中',
      centered: true,
      width: 480,
      okText: '确定',
      cancelText: '取消',
    },
  });
};
</script>
