<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="表格操作示例...">
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            class="demo-btn"
            @click="handlers.insertTable.execute(editor, { rows: 3, cols: 3 }).run()"
          >
            插入表格
          </button>
          <span class="demo-divider"></span>
          <button class="demo-btn" @click="handlers.addColumnBefore.execute(editor).run()">
            前插列
          </button>
          <button class="demo-btn" @click="handlers.addColumnAfter.execute(editor).run()">
            后插列
          </button>
          <button class="demo-btn" @click="handlers.deleteColumn.execute(editor).run()">
            删列
          </button>
          <span class="demo-divider"></span>
          <button class="demo-btn" @click="handlers.addRowBefore.execute(editor).run()">
            前插行
          </button>
          <button class="demo-btn" @click="handlers.addRowAfter.execute(editor).run()">
            后插行
          </button>
          <button class="demo-btn" @click="handlers.deleteRow.execute(editor).run()">删行</button>
          <span class="demo-divider"></span>
          <button class="demo-btn" @click="handlers.mergeCells.execute(editor).run()">合并</button>
          <button class="demo-btn" @click="handlers.splitCell.execute(editor).run()">拆分</button>
          <span class="demo-divider"></span>
          <button class="demo-btn" @click="handlers.toggleHeaderRow.execute(editor).run()">
            切换表头行
          </button>
          <button class="demo-btn" @click="handlers.toggleHeaderColumn.execute(editor).run()">
            切换表头列
          </button>
          <button class="demo-btn" @click="handlers.toggleHeaderCell.execute(editor).run()">
            切换表头格
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：点击"插入表格"创建一个 3×3 表格，然后选中单元格后可使用其他操作。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>表格操作示例。点击工具栏"插入表格"开始。</p>');
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
  flex-wrap: wrap;
}
.demo-btn {
  min-width: 32px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.demo-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}
.demo-divider {
  width: 1px;
  height: 18px;
  background: #e8e8e8;
  margin: 0 4px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}
</style>
