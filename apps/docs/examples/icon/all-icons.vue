<template>
  <div class="icon-gallery">
    <xy-input
      v-model:value="search"
      placeholder="搜索图标，例如：Home"
      allow-clear
      class="icon-search"
    />
    <div class="icon-grid">
      <div
        v-for="item in filteredIcons"
        :key="item.name"
        class="icon-item"
        @click="copy(item.name)"
      >
        <div class="icon-svg">
          <component :is="item.component" />
        </div>
        <span class="icon-name" :title="item.name">{{ item.name }}</span>
      </div>
    </div>
    <div v-if="filteredIcons.length === 0" class="icon-empty">未找到匹配的图标</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import * as Icons from '@xiaoye-ui/icons';
import { message } from 'xiaoye-ui';

const search = ref('');

function toKebab(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

const iconList = Object.entries(Icons)
  .filter(([name, comp]) => {
    return (
      name.endsWith('Icon') &&
      name !== 'Icon' &&
      name !== 'BaseIcon' &&
      name !== 'BlankIcon' &&
      typeof comp === 'object'
    );
  })
  .map(([name, component]) => ({
    name,
    component: component as any,
  }));

const filteredIcons = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return iconList;
  return iconList.filter(item => item.name.toLowerCase().includes(keyword));
});

const copy = async (name: string) => {
  const tag = `<${toKebab(name)} />`;
  let copied = false;
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(tag);
      copied = true;
    }
  } catch {
    copied = false;
  }
  if (!copied) {
    const input = document.createElement('input');
    input.value = tag;
    document.body.appendChild(input);
    input.select();
    copied = document.execCommand('copy');
    document.body.removeChild(input);
  }
  if (copied) {
    message.success(`已复制 ${tag}`);
  } else {
    message.error('复制失败');
  }
};
</script>

<style scoped>
.icon-gallery {
  margin-top: 16px;
}

.icon-search {
  max-width: 320px;
  margin-bottom: 24px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  border-top: 1px solid var(--vp-c-divider);
  border-left: 1px solid var(--vp-c-divider);
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.icon-item:hover {
  background-color: var(--xy-primary-1, #e6f7ff);
  color: var(--xy-primary-6, #1890ff);
}

.icon-svg {
  font-size: 24px;
  margin-bottom: 8px;
  line-height: 1;
}

.icon-name {
  font-size: 12px;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
  color: var(--vp-c-text-2);
}

.icon-item:hover .icon-name {
  color: var(--xy-primary-6, #1890ff);
}

.icon-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--vp-c-text-2);
}
</style>
