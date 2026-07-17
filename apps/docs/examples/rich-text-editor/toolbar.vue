<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="体验完整工具栏...">
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <select class="demo-select" @change="onHeadingChange($event, editor, handlers)">
            <option value="paragraph">正文</option>
            <option value="1">标题 1</option>
            <option value="2">标题 2</option>
            <option value="3">标题 3</option>
          </select>
          <span class="demo-divider"></span>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bold.isActive(editor) }"
            title="加粗"
            @click="handlers.bold.execute(editor).run()"
          >
            B
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.italic.isActive(editor) }"
            title="斜体"
            @click="handlers.italic.execute(editor).run()"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.underline.isActive(editor) }"
            title="下划线"
            @click="handlers.underline.execute(editor).run()"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.strike.isActive(editor) }"
            title="删除线"
            @click="handlers.strike.execute(editor).run()"
          >
            <s>S</s>
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.code.isActive(editor) }"
            title="行内代码"
            @click="handlers.code.execute(editor).run()"
          >
            &lt;/&gt;
          </button>
          <span class="demo-divider"></span>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bulletList.isActive(editor) }"
            title="无序列表"
            @click="handlers.bulletList.execute(editor).run()"
          >
            UL
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.orderedList.isActive(editor) }"
            title="有序列表"
            @click="handlers.orderedList.execute(editor).run()"
          >
            OL
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.taskList.isActive(editor) }"
            title="任务列表"
            @click="handlers.taskList.execute(editor).run()"
          >
            任务
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.blockquote.isActive(editor) }"
            title="引用"
            @click="handlers.blockquote.execute(editor).run()"
          >
            引用
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.codeBlock.isActive(editor) }"
            title="代码块"
            @click="handlers.codeBlock.execute(editor).run()"
          >
            代码块
          </button>
          <span class="demo-divider"></span>
          <button
            type="button"
            class="demo-btn"
            title="分割线"
            @click="handlers.horizontalRule.execute(editor).run()"
          >
            分割线
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.link.isActive(editor) }"
            title="链接"
            @click="handlers.link.execute(editor).run()"
          >
            链接
          </button>
          <span class="demo-divider"></span>
          <button
            type="button"
            class="demo-btn"
            title="撤销"
            @click="handlers.undo.execute(editor).run()"
          >
            撤销
          </button>
          <button
            type="button"
            class="demo-btn"
            title="重做"
            @click="handlers.redo.execute(editor).run()"
          >
            重做
          </button>
          <button
            type="button"
            class="demo-btn"
            title="清除格式"
            @click="handlers.clearFormatting.execute(editor).run()"
          >
            清除
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(
  '<h2>完整工具栏示例</h2><p>包含标题、文本样式、列表、引用、代码块、分割线、链接、撤销重做等操作。</p>',
);

const onHeadingChange = (e: Event, editor: any, handlers: any) => {
  const value = (e.target as HTMLSelectElement).value;
  if (value === 'paragraph') {
    handlers.paragraph.execute(editor).run();
  } else {
    handlers.heading.execute(editor, { level: Number(value) }).run();
  }
  (e.target as HTMLSelectElement).value = 'paragraph';
};
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
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
  height: 32px;
  padding: 0 8px;
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
.demo-btn.is-active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}
.demo-select {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  cursor: pointer;
}
.demo-divider {
  width: 1px;
  height: 20px;
  background: #e8e8e8;
  margin: 0 4px;
}
</style>
