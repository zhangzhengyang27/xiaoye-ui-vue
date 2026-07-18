<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="输入 : 触发 emoji 菜单...">
      <template #default="{ editor }">
        <xy-rich-text-editor-emoji-menu
          v-if="editor"
          :editor="editor"
          :items="items"
          :char="':'"
          :layout="'grid'"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：在编辑器中输入
      <code>:</code>
      会弹出 emoji 网格菜单。支持按 name、shortcodes、tags 过滤。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>开始输入，:smile 召唤 emoji。</p>');

const items = [
  { name: '笑', emoji: '😄', shortcodes: ['smile', 'happy'], tags: ['开心', '笑'] },
  { name: '微笑', emoji: '🙂', shortcodes: ['slight_smile'], tags: ['微笑'] },
  { name: '喜悦', emoji: '😁', shortcodes: ['grin'], tags: ['开心'] },
  { name: '大笑', emoji: '😆', shortcodes: ['laughing'], tags: ['笑'] },
  { name: '爱心', emoji: '❤️', shortcodes: ['heart', 'love'], tags: ['爱'] },
  { name: '点赞', emoji: '👍', shortcodes: ['thumbsup', 'like'], tags: ['赞'] },
  { name: '庆祝', emoji: '🎉', shortcodes: ['tada', 'celebrate'], tags: ['庆祝'] },
  { name: '火焰', emoji: '🔥', shortcodes: ['fire', 'hot'], tags: ['火'] },
  { name: '星星', emoji: '⭐', shortcodes: ['star'], tags: ['星'] },
  { name: '太阳', emoji: '☀️', shortcodes: ['sun'], tags: ['天气'] },
  { name: '月亮', emoji: '🌙', shortcodes: ['moon'], tags: ['夜晚'] },
  { name: '咖啡', emoji: '☕', shortcodes: ['coffee'], tags: ['饮料'] },
  { name: '蛋糕', emoji: '🎂', shortcodes: ['cake', 'birthday'], tags: ['生日'] },
  { name: '苹果', emoji: '🍎', shortcodes: ['apple'], tags: ['水果'] },
  { name: '香蕉', emoji: '🍌', shortcodes: ['banana'], tags: ['水果'] },
  { name: '心碎', emoji: '💔', shortcodes: ['broken_heart'], tags: ['伤心'] },
  { name: '哭', emoji: '😢', shortcodes: ['cry'], tags: ['伤心'] },
  { name: '生气', emoji: '😠', shortcodes: ['angry'], tags: ['愤怒'] },
  { name: '惊讶', emoji: '😮', shortcodes: ['surprised'], tags: ['惊讶'] },
  { name: '思考', emoji: '🤔', shortcodes: ['think'], tags: ['思考'] },
  { name: '挥手', emoji: '👋', shortcodes: ['wave', 'hello'], tags: ['打招呼'] },
  { name: '鼓掌', emoji: '👏', shortcodes: ['clap'], tags: ['鼓掌'] },
  { name: '肌肉', emoji: '💪', shortcodes: ['muscle'], tags: ['力量'] },
  { name: '眼睛', emoji: '👀', shortcodes: ['eyes'], tags: ['看'] },
];
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: #c41d7f;
}
</style>
