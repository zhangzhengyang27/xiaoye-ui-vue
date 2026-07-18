<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="点击工具栏的图片按钮选择本地图片...">
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            class="demo-btn"
            :class="{ 'is-active': false }"
            title="插入图片"
            @click="handlers.image.execute(editor).run()"
          >
            📷 插入图片
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：默认 image handler 会弹出文件选择框，选择本地图片后会转为 base64
      插入到编辑器中。如需自定义上传逻辑，可通过 `handlers` prop 覆盖 `image.execute`。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>图片插入示例。点击工具栏按钮选择本地图片。</p>');
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
  padding: 0 12px;
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
.demo-tip {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}
</style>
