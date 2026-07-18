<template>
  <div class="reply-list-wrapper">
    <!-- 新评论输入区 -->
    <xy-comment class="reply-list-editor">
      <template #avatar>
        <xy-avatar src="https://joeschmoe.io/api/v1/random" alt="当前用户" />
      </template>
      <template #content>
        <xy-textarea
          v-model:value="draft"
          :rows="3"
          placeholder="说点什么吧…"
          :maxlength="200"
          show-count
        />
        <div class="reply-list-editor-actions">
          <xy-typography-text type="secondary">共 {{ list.length }} 条评论</xy-typography-text>
          <xy-button
            type="primary"
            :loading="submitting"
            :disabled="!draft.trim()"
            @click="handleSubmit"
          >
            发布评论
          </xy-button>
        </div>
      </template>
    </xy-comment>

    <xy-divider />

    <!-- 评论列表 -->
    <xy-list v-if="list.length" :data-source="list" item-layout="horizontal" :split="true">
      <template #renderItem="{ item }">
        <xy-list-item>
          <xy-comment :author="item.author" :datetime="item.datetime">
            <template #avatar>
              <xy-avatar :src="item.avatar" :alt="item.author" />
            </template>
            <template #content>
              <xy-typography-paragraph>{{ item.content }}</xy-typography-paragraph>
            </template>
            <template #actions>
              <span class="reply-list-action" @click="handleLike(item)">
                <LikeOutlined :class="{ 'action-active': item.liked }" />
                <span class="action-count">{{ item.likes }}</span>
              </span>
              <span class="reply-list-action" @click="focusReply(item)">
                <MessageOutlined />
                <span>回复</span>
              </span>
            </template>
          </xy-comment>
        </xy-list-item>
      </template>
    </xy-list>

    <xy-empty v-else description="还没有评论，快来抢沙发" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LikeOutlined, MessageOutlined } from '@xiaoye-ui/icons';
import { message } from 'xiaoye-ui';

dayjs.extend(relativeTime);

interface ReplyItem {
  id: number;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
  likes: number;
  liked: boolean;
}

let seed = 3;
const draft = ref<string>('');
const submitting = ref<boolean>(false);

const list = ref<ReplyItem[]>([
  {
    id: 1,
    author: '林晚星',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content:
      'XiaoyeUI 的设计 Token 体系非常清晰，从 Seed Token 到 Component Token 的链路很好理解。',
    datetime: dayjs().subtract(2, 'hour').fromNow(),
    likes: 8,
    liked: false,
  },
  {
    id: 2,
    author: '陈墨白',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '同意楼上的观点，CSS-in-JS 方案让组件样式维护成本降低不少。',
    datetime: dayjs().subtract(35, 'minute').fromNow(),
    likes: 3,
    liked: false,
  },
]);

const handleSubmit = () => {
  if (!draft.value.trim()) return;
  submitting.value = true;
  // 模拟提交延迟
  setTimeout(() => {
    list.value = [
      ...list.value,
      {
        id: ++seed,
        author: '当前用户',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: draft.value.trim(),
        datetime: '刚刚',
        likes: 0,
        liked: false,
      },
    ];
    draft.value = '';
    submitting.value = false;
    message.success('评论已发布');
  }, 600);
};

const handleLike = (item: ReplyItem) => {
  if (item.liked) {
    item.likes -= 1;
    item.liked = false;
  } else {
    item.likes += 1;
    item.liked = true;
  }
};

const focusReply = (item: ReplyItem) => {
  draft.value = `@${item.author} `;
};
</script>

<style scoped>
.reply-list-wrapper {
  width: 100%;
}
.reply-list-editor-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.reply-list-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.2s;
}
.reply-list-action:hover {
  color: #1677ff;
}
.action-active {
  color: #eb2f96;
}
.action-count {
  padding-left: 4px;
  user-select: none;
}
</style>
