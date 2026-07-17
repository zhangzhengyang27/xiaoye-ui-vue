<template>
  <div class="demo-wrap">
    <div class="demo-config">
      <div class="demo-config-item">
        <xy-switch v-model:checked="imageEnabled" />
        <span>image（图片）</span>
      </div>
      <div class="demo-config-item">
        <xy-switch v-model:checked="mentionEnabled" />
        <span>mention（@提及）</span>
      </div>
      <div class="demo-config-item">
        <xy-switch v-model:checked="tableEnabled" />
        <span>table（表格）</span>
      </div>
      <div class="demo-config-item">
        <xy-switch v-model:checked="shikiEnabled" />
        <span>codeBlockShiki（代码高亮）</span>
      </div>
    </div>
    <xy-rich-text-editor
      :key="configKey"
      v-model="content"
      :image="imageEnabled"
      :mention="mentionEnabled"
      :table="tableEnabled"
      :code-block-shiki="shikiEnabled"
      :starter-kit="{ heading: { levels: [1, 2, 3] } }"
      placeholder="扩展配置会动态调整可用能力..."
    >
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bold.isActive(editor) }"
            @click="handlers.bold.execute(editor).run()"
          >
            B
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.italic.isActive(editor) }"
            @click="handlers.italic.execute(editor).run()"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.heading.isActive(editor, { level: 1 }) }"
            @click="handlers.heading.execute(editor, { level: 1 }).run()"
          >
            H1
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.heading.isActive(editor, { level: 2 }) }"
            @click="handlers.heading.execute(editor, { level: 2 }).run()"
          >
            H2
          </button>
          <button
            v-if="tableEnabled"
            type="button"
            class="demo-btn"
            @click="handlers.insertTable.execute(editor, { rows: 3, cols: 3 }).run()"
          >
            插入表格
          </button>
          <button
            v-if="imageEnabled"
            type="button"
            class="demo-btn"
            @click="
              handlers.image.execute(editor, { src: 'https://via.placeholder.com/150' }).run()
            "
          >
            插入图片
          </button>
          <button
            v-if="mentionEnabled"
            type="button"
            class="demo-btn"
            @click="handlers.mention.execute(editor).run()"
          >
            @提及
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <p class="demo-tip">
      通过 `image` / `mention` / `table` / `codeBlockShiki` 等属性可开关对应扩展；`starterKit`
      可配置内置扩展（如标题级别）。切换开关后会重建编辑器实例。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const imageEnabled = ref(true);
const mentionEnabled = ref(true);
const tableEnabled = ref(true);
const shikiEnabled = ref(true);
const content = ref('<p>切换上方开关，调整编辑器扩展能力。</p>');

// 任一开关变化时，重建编辑器以应用新配置
const configKey = computed(
  () => `${imageEnabled.value}-${mentionEnabled.value}-${tableEnabled.value}-${shikiEnabled.value}`,
);
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-config {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}
.demo-config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
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
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
