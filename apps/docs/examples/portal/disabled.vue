<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-space align="center">
      <xy-switch
        v-model:checked="disabled"
        checked-children="禁用传送"
        un-checked-children="启用传送"
      />
      <span class="tip">
        当前状态：{{ disabled ? '内容原地渲染（disabled）' : '内容传送到 body' }}
      </span>
    </xy-space>

    <div class="overflow-box">
      <p>
        父容器设置了
        <code>overflow: hidden</code>
        。
      </p>
      <xy-portal :disabled="disabled">
        <div class="inline-card">
          <p>我是 Portal 内的内容。</p>
          <p v-if="disabled">当前 disabled=true，我原地渲染，超出会被父容器裁剪。</p>
          <p v-else>当前 disabled=false，我已传送到 body，不受父容器 overflow 影响。</p>
        </div>
      </xy-portal>
    </div>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const disabled = ref(false);
</script>
<style scoped>
.overflow-box {
  height: 120px;
  padding: 12px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}
.tip {
  color: #888;
}
.inline-card {
  margin-top: 12px;
  padding: 16px;
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 6px;
}
</style>
