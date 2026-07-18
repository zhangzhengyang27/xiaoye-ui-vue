<template>
  <div class="nested-reply-wrapper">
    <xy-list :data-source="comments" item-layout="horizontal" :split="false">
      <template #renderItem="{ item }">
        <xy-list-item>
          <!-- 父级评论 -->
          <xy-comment :author="item.author" :datetime="item.datetime">
            <template #avatar>
              <xy-avatar :src="item.avatar" :alt="item.author" />
            </template>
            <template #content>
              <p>{{ item.content }}</p>
            </template>
            <template #actions>
              <span class="nested-action" @click="toggleReply(item)">
                <MessageOutlined />
                <span>{{ item.replyOpen ? '收起回复' : `回复 (${item.children.length})` }}</span>
              </span>
            </template>
          </xy-comment>

          <!-- 子级回复列表（最多 2 层） -->
          <div v-if="item.replyOpen && item.children.length" class="nested-children">
            <xy-list :data-source="item.children" item-layout="horizontal" :split="false">
              <template #renderItem="{ item: child }">
                <xy-list-item>
                  <xy-comment :author="child.author" :datetime="child.datetime">
                    <template #avatar>
                      <xy-avatar :src="child.avatar" :alt="child.author" />
                    </template>
                    <template #content>
                      <p>
                        <xy-typography-text type="secondary" strong>
                          @{{ child.replyTo }}
                        </xy-typography-text>
                        {{ child.content }}
                      </p>
                    </template>
                    <template #actions>
                      <span class="nested-action" @click="toggleLike(child)">
                        <LikeOutlined :class="{ liked: child.liked }" />
                        <span>{{ child.likes }}</span>
                      </span>
                      <span class="nested-action" @click="appendQuickReply(item, child)">
                        快速回复
                      </span>
                    </template>
                  </xy-comment>
                </xy-list-item>
              </template>
            </xy-list>

            <!-- 子级回复输入框 -->
            <xy-comment class="nested-reply-input">
              <template #avatar>
                <xy-avatar src="https://joeschmoe.io/api/v1/random" alt="我" />
              </template>
              <template #content>
                <xy-input
                  v-model:value="item.draft"
                  :placeholder="`回复 ${item.author}…`"
                  @press-enter="submitReply(item)"
                >
                  <template #suffix>
                    <xy-button
                      type="link"
                      size="small"
                      :disabled="!item.draft?.trim()"
                      @click="submitReply(item)"
                    >
                      发送
                    </xy-button>
                  </template>
                </xy-input>
              </template>
            </xy-comment>
          </div>
        </xy-list-item>
      </template>
    </xy-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LikeOutlined, MessageOutlined } from '@xiaoye-ui/icons';
import { message } from 'xiaoye-ui';

dayjs.extend(relativeTime);

interface ChildComment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
  replyTo: string;
  likes: number;
  liked: boolean;
}

interface ParentComment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
  replyOpen: boolean;
  draft: string;
  children: ChildComment[];
}

let childSeed = 100;
const comments = ref<ParentComment[]>([
  {
    id: 1,
    author: '林晚星',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: 'XiaoyeUI 的组件分类非常清晰，数据展示类组件覆盖场景很全面。',
    datetime: dayjs().subtract(2, 'hour').fromNow(),
    replyOpen: true,
    draft: '',
    children: [
      {
        id: 11,
        author: '陈墨白',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: '是的，特别是 Statistic 和 Comment 这一类组件应用频率很高。',
        datetime: dayjs().subtract(1, 'hour').fromNow(),
        replyTo: '林晚星',
        likes: 2,
        liked: false,
      },
      {
        id: 12,
        author: '苏清颜',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: '同意，希望能补更多嵌套回复相关的示例。',
        datetime: dayjs().subtract(40, 'minute').fromNow(),
        replyTo: '陈墨白',
        likes: 1,
        liked: false,
      },
    ],
  },
  {
    id: 2,
    author: '周岚',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '文档示例非常实用，已经照着在自己的项目中实践了。',
    datetime: dayjs().subtract(30, 'minute').fromNow(),
    replyOpen: false,
    draft: '',
    children: [],
  },
]);

const toggleReply = (item: ParentComment) => {
  item.replyOpen = !item.replyOpen;
};

const toggleLike = (child: ChildComment) => {
  if (child.liked) {
    child.likes -= 1;
    child.liked = false;
  } else {
    child.likes += 1;
    child.liked = true;
  }
};

const submitReply = (parent: ParentComment) => {
  if (!parent.draft?.trim()) return;
  parent.children.push({
    id: ++childSeed,
    author: '我',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: parent.draft.trim(),
    datetime: '刚刚',
    replyTo: parent.author,
    likes: 0,
    liked: false,
  });
  parent.draft = '';
  parent.replyOpen = true;
  message.success('回复成功');
};

const appendQuickReply = (parent: ParentComment, child: ChildComment) => {
  parent.draft = `@${child.author} `;
  parent.replyOpen = true;
};
</script>

<style scoped>
.nested-reply-wrapper {
  width: 100%;
}
.nested-children {
  margin-left: 48px;
  padding-left: 16px;
  border-left: 2px solid #f0f0f0;
}
.nested-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.2s;
}
.nested-action:hover {
  color: #1677ff;
}
.nested-action .liked {
  color: #eb2f96;
}
.nested-reply-input {
  margin-top: 12px;
}
</style>
