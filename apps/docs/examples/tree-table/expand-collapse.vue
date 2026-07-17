<template>
  <div class="wrapper">
    <div class="toolbar">
      <xy-button size="small" @click="expandAll">全部展开</xy-button>
      <xy-button size="small" @click="collapseAll">全部收起</xy-button>
      <span class="hint">当前展开：{{ expandedCount }} 个节点</span>
      <span v-if="lastAction" class="hint">{{ lastAction }}</span>
    </div>
    <xy-tree-table
      v-model:expanded-keys="expandedKeys"
      :value="nodes"
      @node-expand="onNodeExpand"
      @node-collapse="onNodeCollapse"
    >
      <Column field="name" header="名称" expander />
      <Column field="status" header="状态" />
      <Column field="owner" header="负责人" />
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
  data: { name: string; status: string; owner: string };
  children?: TreeNode[];
}

const nodes: TreeNode[] = [
  {
    key: '0',
    data: { name: '项目 Alpha', status: '进行中', owner: '张伟' },
    children: [
      {
        key: '0-0',
        data: { name: '需求分析', status: '已完成', owner: '李娜' },
        children: [
          { key: '0-0-0', data: { name: '用户调研', status: '已完成', owner: '王芳' } },
          { key: '0-0-1', data: { name: '竞品分析', status: '已完成', owner: '刘强' } },
        ],
      },
      {
        key: '0-1',
        data: { name: '开发实现', status: '进行中', owner: '陈明' },
        children: [
          { key: '0-1-0', data: { name: '前端开发', status: '进行中', owner: '王芳' } },
          { key: '0-1-1', data: { name: '后端开发', status: '进行中', owner: '刘强' } },
        ],
      },
    ],
  },
  {
    key: '1',
    data: { name: '项目 Beta', status: '已立项', owner: '赵敏' },
    children: [{ key: '1-0', data: { name: '技术选型', status: '进行中', owner: '孙莉' } }],
  },
];

const expandedKeys = ref<Record<string, boolean>>({});

// 收集所有有子节点的节点 key
function collectAllKeys(list: TreeNode[], acc: string[] = []): string[] {
  list.forEach(n => {
    if (n.children && n.children.length) {
      acc.push(n.key);
      collectAllKeys(n.children, acc);
    }
  });
  return acc;
}

function expandAll() {
  const allKeys = collectAllKeys(nodes);
  const map: Record<string, boolean> = {};
  allKeys.forEach(k => (map[k] = true));
  expandedKeys.value = map;
}

function collapseAll() {
  expandedKeys.value = {};
}

const expandedCount = computed(
  () => Object.keys(expandedKeys.value).filter(k => expandedKeys.value[k]).length,
);

const lastAction = ref('');

function onNodeExpand(node: TreeNode) {
  lastAction.value = `已展开：${node.data.name}`;
}

function onNodeCollapse(node: TreeNode) {
  lastAction.value = `已收起：${node.data.name}`;
}
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
  gap: 8px;
}
.hint {
  margin-left: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
