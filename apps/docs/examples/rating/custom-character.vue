<template>
  <xy-space direction="vertical">
    <div>
      <span class="demo-label">自定义字符：</span>
      <xy-rating v-model:value="value" :character="renderHeart" />
      <span class="demo-value">{{ value }}</span>
    </div>
    <div>
      <span class="demo-label">使用插槽：</span>
      <xy-rating v-model:value="value1">
        <template #character="{ index }">
          <span class="demo-custom-char">{{ index }}</span>
        </template>
      </xy-rating>
      <span class="demo-value">{{ value1 }}</span>
    </div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, h } from 'vue';
import { HeartIcon } from '@xiaoye-ui/icons';

// 自定义评分字符：可通过 character 渲染函数或 #character 插槽实现。
const value = ref(3);
const value1 = ref(2);

const renderHeart = () => h(HeartIcon);
</script>
<style scoped>
.demo-label {
  display: inline-block;
  width: 100px;
  color: rgba(0, 0, 0, 0.65);
}
.demo-value {
  margin-left: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.demo-custom-char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  border: 1px solid currentColor;
  border-radius: 50%;
}
</style>
