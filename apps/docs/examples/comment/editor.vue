<template>
  <xy-list
    v-if="comments.length"
    :data-source="comments"
    :header="`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`"
    item-layout="horizontal"
  >
    <template #renderItem="{ item }">
      <xy-list-item>
        <xy-comment
          :author="item.author"
          :avatar="item.avatar"
          :content="item.content"
          :datetime="item.datetime"
        />
      </xy-list-item>
    </template>
  </xy-list>
  <xy-comment>
    <template #avatar>
      <xy-avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
    </template>
    <template #content>
      <xy-form-item>
        <xy-textarea v-model:value="value" :rows="4" />
      </xy-form-item>
      <xy-form-item>
        <xy-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
          Add Comment
        </xy-button>
      </xy-form-item>
    </template>
  </xy-comment>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type Comment = Record<string, string>;

const comments = ref<Comment[]>([]);
const submitting = ref<boolean>(false);
const value = ref<string>('');
const handleSubmit = () => {
  if (!value.value) {
    return;
  }

  submitting.value = true;

  setTimeout(() => {
    submitting.value = false;
    comments.value = [
      {
        author: 'Han Solo',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: value.value,
        datetime: dayjs().fromNow(),
      },
      ...comments.value,
    ];
    value.value = '';
  }, 1000);
};
</script>
