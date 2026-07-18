<template>
  <div class="comment-editor-wrapper">
    <!-- 编辑器：使用 xy-comment 的 content slot 自定义编辑器 UI -->
    <xy-comment class="editor-comment">
      <template #avatar>
        <xy-avatar src="https://joeschmoe.io/api/v1/random" alt="当前用户" />
      </template>
      <template #content>
        <div class="editor-textarea-wrapper">
          <xy-textarea
            v-model:value="draft"
            :rows="4"
            :maxlength="500"
            show-count
            placeholder="分享你的想法…"
            @focus="focused = true"
          />
        </div>

        <!-- 工具栏：表情、图片上传按钮（仅 UI 演示） -->
        <div v-if="focused || draft" class="editor-toolbar">
          <xy-space :size="4">
            <xy-tooltip title="插入表情">
              <xy-button type="text" size="small" @click="insertEmoji">
                <template #icon><SmileOutlined /></template>
              </xy-button>
            </xy-tooltip>
            <xy-tooltip title="上传图片">
              <xy-button type="text" size="small" @click="triggerUpload">
                <template #icon><ImageIcon /></template>
              </xy-button>
            </xy-tooltip>
            <xy-tooltip title="@提及他人">
              <xy-button type="text" size="small" @click="insertMention">
                <template #icon><UserOutlined /></template>
              </xy-button>
            </xy-tooltip>
            <xy-tooltip title="插入链接">
              <xy-button type="text" size="small" @click="insertLink">
                <template #icon><LinkIcon /></template>
              </xy-button>
            </xy-tooltip>
          </xy-space>

          <xy-space :size="8">
            <xy-button @click="handleCancel">取消</xy-button>
            <xy-button
              type="primary"
              :loading="submitting"
              :disabled="!draft.trim()"
              @click="handleSubmit"
            >
              发布
            </xy-button>
          </xy-space>
        </div>

        <!-- 已选附件预览（仅 UI） -->
        <div v-if="attachments.length" class="editor-attachments">
          <div v-for="(att, idx) in attachments" :key="idx" class="attachment-item">
            <ImageIcon />
            <span class="attachment-name">{{ att }}</span>
            <xy-button type="text" size="small" @click="attachments.splice(idx, 1)">
              <CloseOutlined />
            </xy-button>
          </div>
        </div>
      </template>
    </xy-comment>

    <xy-divider />

    <!-- 提交后追加的评论列表 -->
    <xy-list v-if="list.length" :data-source="list" item-layout="horizontal">
      <template #renderItem="{ item }">
        <xy-list-item>
          <xy-comment :author="item.author" :datetime="item.datetime">
            <template #avatar>
              <xy-avatar :src="item.avatar" :alt="item.author" />
            </template>
            <template #content>
              <p>{{ item.content }}</p>
            </template>
          </xy-comment>
        </xy-list-item>
      </template>
    </xy-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SmileOutlined, ImageIcon, UserOutlined, LinkIcon, CloseOutlined } from '@xiaoye-ui/icons';
import { message } from 'xiaoye-ui';

dayjs.extend(relativeTime);

interface CommentItem {
  id: number;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
}

let seed = 0;
const draft = ref<string>('');
const focused = ref<boolean>(false);
const submitting = ref<boolean>(false);
const attachments = ref<string[]>([]);
const list = ref<CommentItem[]>([]);

const insertEmoji = () => {
  draft.value += '😀';
};

const triggerUpload = () => {
  // 仅 UI 演示：模拟选择了一张图片
  attachments.value.push(`图片_${++seed}.png`);
};

const insertMention = () => {
  draft.value += '@';
};

const insertLink = () => {
  draft.value += '[文本](https://)';
};

const handleCancel = () => {
  draft.value = '';
  attachments.value = [];
  focused.value = false;
};

const handleSubmit = () => {
  if (!draft.value.trim()) return;
  submitting.value = true;
  setTimeout(() => {
    list.value = [
      {
        id: ++seed,
        author: '当前用户',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: draft.value.trim(),
        datetime: dayjs().fromNow(),
      },
      ...list.value,
    ];
    draft.value = '';
    attachments.value = [];
    submitting.value = false;
    focused.value = false;
    message.success('评论已发布');
  }, 600);
};
</script>

<style scoped>
.comment-editor-wrapper {
  width: 100%;
}
.editor-textarea-wrapper {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 4px;
  transition: border-color 0.2s;
}
.editor-textarea-wrapper:focus-within {
  border-color: #1677ff;
}
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.editor-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.attachment-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
.attachment-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
