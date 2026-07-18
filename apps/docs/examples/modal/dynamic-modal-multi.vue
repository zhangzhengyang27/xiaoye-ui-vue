<template>
  <xy-space direction="vertical">
    <xy-space>
      <xy-button type="primary" @click="openOne">打开弹窗 1</xy-button>
      <xy-button @click="openTwo">打开弹窗 2</xy-button>
      <xy-button danger @click="closeAll">全部关闭</xy-button>
    </xy-space>
    <p style="margin: 0; color: #999; font-size: 13px">当前打开弹窗数：{{ refs.length }}</p>
    <holder />
  </xy-space>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { useDynamicModal } from 'xiaoye-ui';
import type { DynamicModalRef } from 'xiaoye-ui';

const [modal, holder] = useDynamicModal();
const refs = ref<DynamicModalRef[]>([]);

// 弹窗内容组件：展示序号与颜色标识
const ColorBox = defineComponent({
  name: 'ColorBox',
  props: ['index', 'color'],
  render() {
    return h(
      'div',
      {
        style: `padding: 32px 16px; background: ${this.color}; color: #fff; border-radius: 8px; text-align: center; font-size: 18px; font-weight: 500;`,
      },
      `弹窗 ${this.index}`,
    );
  },
});

const colors = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];

const openOne = () => {
  const index = refs.value.length + 1;
  const color = colors[(index - 1) % colors.length];
  const ref = modal.open(ColorBox, {
    componentProps: { index, color },
    modalProps: {
      title: `弹窗 ${index}`,
      width: 400,
      okText: '关闭',
      cancelText: '取消',
    },
  });
  // 弹窗关闭后从 refs 中移除
  refs.value = [...refs.value, ref];
};

const openTwo = () => {
  // 连续打开两个弹窗
  openOne();
  openOne();
};

const closeAll = () => {
  refs.value.forEach(r => r.destroy());
  refs.value = [];
};
</script>
