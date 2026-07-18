<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      v-model="content"
      placeholder="点击工具栏插入图片，会模拟上传..."
      :handlers="customHandlers"
    >
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            class="demo-btn"
            :disabled="uploading"
            @click="handlers.image.execute(editor).run()"
          >
            <span v-if="uploading">⏳ 上传中...</span>
            <span v-else>📷 上传图片</span>
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：此示例通过 `handlers` prop 自定义 image
      handler，模拟异步上传。实际应用中替换为真实的上传 API 即可。
    </div>
    <div v-if="lastUploadUrl" class="demo-info">
      <div>最近上传：{{ lastUploadUrl }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { createImageHandler } from 'xiaoye-ui/rich-text-editor';

const content = ref('<p>自定义图片上传示例。点击工具栏按钮选择本地图片。</p>');
const uploading = ref(false);
const lastUploadUrl = ref('');

// 模拟上传服务：返回一个 picsum 占位图 URL
const mockUpload = (file: File): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 用 picsum.photos 作为占位图，根据文件大小生成不同 seed
      const seed = file.size % 1000;
      resolve(`https://picsum.photos/seed/${seed}/400/300`);
    }, 1500); // 模拟 1.5 秒上传延迟
  });
};

// 自定义 image handler
const baseImageHandler = createImageHandler();
const customHandlers = {
  image: {
    ...baseImageHandler,
    execute: (editor: any, cmd: any) => {
      // 如果已经有 src，直接插入
      if (cmd?.src) {
        return editor.chain().focus().setImage({ src: cmd.src });
      }

      // 创建文件选择 input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        uploading.value = true;
        try {
          // 调用模拟上传服务
          const url = await mockUpload(file);
          lastUploadUrl.value = url;
          // 插入到编辑器
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } catch (e) {
          console.error('上传失败', e);
        } finally {
          uploading.value = false;
        }
      };
      input.click();

      return editor.chain();
    },
  },
};
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
}
.demo-btn {
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
.demo-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}
.demo-info {
  font-size: 12px;
  color: #666;
  padding: 8px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
}
</style>
