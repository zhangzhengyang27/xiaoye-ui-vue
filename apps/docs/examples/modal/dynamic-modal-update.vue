<template>
  <xy-space>
    <xy-button type="primary" @click="openModal">打开弹窗</xy-button>
    <xy-button @click="updateContent">更新内容</xy-button>
    <xy-button danger @click="destroyModal">销毁弹窗</xy-button>
  </xy-space>
  <holder />
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { useDynamicModal } from 'xiaoye-ui';
import type { DynamicModalRef } from 'xiaoye-ui';

const [modal, holder] = useDynamicModal();
const modalRef = ref<DynamicModalRef | null>(null);
const count = ref(0);

const ContentComponent = defineComponent({
  name: 'UpdateContent',
  props: ['count'],
  render() {
    return h('div', { style: 'padding: 16px 0; color: #333; line-height: 1.8;' }, [
      h('p', `当前计数：${this.count}`),
      h(
        'p',
        { style: 'color: #999; font-size: 13px;' },
        '点击「更新内容」按钮可动态修改弹窗内的数据。',
      ),
    ]);
  },
});

const openModal = () => {
  count.value = 0;
  modalRef.value = modal.open(ContentComponent, {
    componentProps: {
      count: count.value,
    },
    modalProps: {
      title: '动态更新示例',
      okText: '确定',
      cancelText: '取消',
    },
  });
};

const updateContent = () => {
  if (!modalRef.value) {
    console.warn('弹窗尚未打开');
    return;
  }
  count.value += 1;
  modalRef.value.update({
    componentProps: {
      count: count.value,
    },
    modalProps: {
      title: `动态更新示例（第 ${count.value} 次更新）`,
    },
  });
};

const destroyModal = () => {
  modalRef.value?.destroy();
  modalRef.value = null;
};
</script>
