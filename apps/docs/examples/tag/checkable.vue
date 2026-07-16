<template>
  <span style="margin-right: 8px">Categories:</span>
  <a-space :size="[0, 8]" wrap>
    <a-checkable-tag
      v-for="(tag, index) in tagsData"
      :key="tag"
      v-model:checked="selectTags[index]"
      @change="checked => handleChange(tag, checked)"
    >
      {{ tag }}
    </a-checkable-tag>
  </a-space>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
const tagsData = reactive(['Movies', 'Books', 'Music', 'Sports']);
const selectTags = reactive([false, true, false, false]);
const handleChange = (tag: string, checked: boolean) => {
  console.log(tag, checked);
};
</script>
