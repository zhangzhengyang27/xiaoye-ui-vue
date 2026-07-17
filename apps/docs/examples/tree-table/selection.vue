<template>
  <div class="wrapper">
    <div class="toolbar">
      <xy-radio-group v-model:value="mode">
        <xy-radio-button value="single">单选</xy-radio-button>
        <xy-radio-button value="multiple">多选</xy-radio-button>
        <xy-radio-button value="checkbox">复选框</xy-radio-button>
      </xy-radio-group>
      <span class="hint">已选：{{ selectedText }}</span>
    </div>
    <xy-tree-table v-model:selection-keys="selectionKeys" :value="nodes" :selection-mode="mode">
      <Column field="name" header="名称" expander />
      <Column field="role" header="角色" />
      <Column field="dept" header="部门" />
    </xy-tree-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';

const Column = defineComponent({
  name: 'Column',
  props: {
    field: String,
    header: String,
    sortable: Boolean,
    expander: Boolean,
    frozen: Boolean,
    alignFrozen: String,
    filterField: String,
    filterMatchMode: String,
    filterHeaderStyle: Object,
    filterHeaderClass: String,
    headerStyle: Object,
    headerClass: String,
    bodyStyle: Object,
    bodyClass: String,
    footerStyle: Object,
    footerClass: String,
    footer: String,
    sortField: String,
    columnKey: String,
    style: Object,
    class: [String, Object, Array],
    hidden: Boolean,
  },
  setup() {
    return () => null;
  },
});

interface TreeNode {
  key: string;
  data: { name: string; role: string; dept: string };
  children?: TreeNode[];
}

const mode = ref<'single' | 'multiple' | 'checkbox'>('single');
const selectionKeys = ref<Record<string, boolean>>({});

const nodes: TreeNode[] = [
  {
    key: '0',
    data: { name: '张伟', role: '技术总监', dept: '研发中心' },
    children: [
      {
        key: '0-0',
        data: { name: '李娜', role: '前端组长', dept: '研发中心' },
        children: [
          { key: '0-0-0', data: { name: '王芳', role: '前端工程师', dept: '研发中心' } },
          { key: '0-0-1', data: { name: '刘强', role: '前端工程师', dept: '研发中心' } },
        ],
      },
      { key: '0-1', data: { name: '陈明', role: '后端组长', dept: '研发中心' } },
    ],
  },
  {
    key: '1',
    data: { name: '赵敏', role: '产品总监', dept: '产品中心' },
    children: [{ key: '1-0', data: { name: '孙莉', role: '产品经理', dept: '产品中心' } }],
  },
];

const selectedText = computed(() => {
  const keys = Object.keys(selectionKeys.value).filter(k => selectionKeys.value[k]);
  if (!keys.length) return '无';
  const names: string[] = [];
  const walk = (list: TreeNode[]) => {
    list.forEach(n => {
      if (keys.includes(n.key)) names.push(n.data.name);
      if (n.children) walk(n.children);
    });
  };
  walk(nodes);
  return names.join('、');
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.hint {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
